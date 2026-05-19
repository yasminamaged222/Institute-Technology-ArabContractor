using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly IRepository<AppUser> _userRepository;
        private readonly IRepository<Cart> _cartRepository;
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Enrollment> _enrollmentRepository;

        public CheckoutService(
            IRepository<AppUser> userRepository,
            IRepository<Cart> cartRepository,
            IRepository<Order> orderRepository,
            IRepository<OrderItem> orderItemRepository,
            IRepository<Payment> paymentRepository,
            IRepository<Enrollment> enrollmentRepository)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _paymentRepository = paymentRepository;
            _enrollmentRepository = enrollmentRepository;
        }

        public async Task<AppUser> GetUserByClerkIdAsync(string clerkUserId)
        {
            var spec = new BaseSpecification<AppUser>(u => u.ClerkUserId == clerkUserId);
            return (await _userRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        public async Task UpdateOrderGatewayDataAsync(Order order)
        {
            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            var spec = new BaseSpecification<Order>(o => o.Id == orderId);
            spec.AddInclude(o => o.Items);
            spec.AddInclude("Items.Planwork");

            return (await _orderRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        public async Task<Order> CreateOrderAsync(int userId)
        {
            var spec = new BaseSpecification<Cart>(c => c.UserId == userId && !c.IsCheckedOut);
            spec.AddInclude(c => c.Items);

            var cart = (await _cartRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();

            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty");

            // ✅ لو في order pending موجود للـ user ده، ارجعه بدل ما تعمل واحد جديد
            // ده بيحل مشكلة لما المستخدم يروح صفحة الدفع ويرجع تاني
            var existingOrderSpec = new BaseSpecification<Order>(
                o => o.UserId == userId && o.Status == OrderStatus.Pending);
            existingOrderSpec.AddInclude(o => o.Items);
            var existingOrder = (await _orderRepository.GetAllWithSpecAsync(existingOrderSpec))
                .FirstOrDefault();

            if (existingOrder != null)
                return existingOrder;

            // ✅ مفيش order pending — اعمل order جديد
            var total = cart.Items.Sum(i => i.Price);

            var order = new Order
            {
                UserId = userId,
                TotalAmount = total,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();

            foreach (var item in cart.Items)
            {
                await _orderItemRepository.AddAsync(new OrderItem
                {
                    OrderId = order.Id,
                    PlanworkId = item.PlanworkId,
                    Price = item.Price,
                    IsOnline = item.IsOnline  // ✅ ينقل IsOnline من CartItem
                });
            }

            var payment = new Payment
            {
                OrderId = order.Id,
                Amount = total,
                Method = PaymentMethod.Visa,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);

            // ✅ مش بنعمل cart.IsCheckedOut = true هنا
            // الكارت يفضل موجود لحد ما الدفع يتأكد فعلاً في MarkOrderAsPaidAsync

            await _orderRepository.SaveChangesAsync();

            return order;
        }

        public async Task UpdateOrderAsync(Order order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        public async Task<Payment> MarkOrderAsPaidAsync(Order order, string transactionRef, string gatewayResponse)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            var paymentSpec = new BaseSpecification<Payment>(p => p.OrderId == order.Id);
            var payment = (await _paymentRepository.GetAllWithSpecAsync(paymentSpec)).FirstOrDefault();

            if (payment == null)
                throw new Exception("Payment record not found for this order.");

            payment.Status = PaymentStatus.Success;
            payment.TransactionRef = transactionRef;
            payment.GatewayResponse = gatewayResponse;
            payment.PaymentDate = DateTime.UtcNow;
            payment.Method = PaymentMethod.Visa;
            _paymentRepository.Update(payment);

            order.Status = OrderStatus.Paid;
            _orderRepository.Update(order);

            // ✅ هنا بس نعمل الكارت IsCheckedOut = true بعد تأكيد الدفع فعلاً
            var cartSpec = new BaseSpecification<Cart>(c => c.UserId == order.UserId && !c.IsCheckedOut);
            var cart = (await _cartRepository.GetAllWithSpecAsync(cartSpec)).FirstOrDefault();
            if (cart != null)
            {
                cart.IsCheckedOut = true;
                _cartRepository.Update(cart);
            }

            foreach (var item in order.Items)
            {
                var enrollmentExists = await _enrollmentRepository.AnyAsync(
                    e => e.UserId == order.UserId && e.PlanworkId == item.PlanworkId);

                if (!enrollmentExists)
                {
                    await _enrollmentRepository.AddAsync(new Enrollment
                    {
                        UserId = order.UserId,
                        PlanworkId = item.PlanworkId,
                        OrderId = order.Id,
                        EnrolledAt = DateTime.UtcNow,
                        IsOnline = item.IsOnline  // ✅ ينقل IsOnline من OrderItem
                    });
                }
            }

            await _orderRepository.SaveChangesAsync();

            return payment;
        }
    }
}