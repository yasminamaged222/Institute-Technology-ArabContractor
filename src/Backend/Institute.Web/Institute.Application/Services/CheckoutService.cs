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
        private readonly IRepository<CartItem> _cartItemRepository;
        private readonly IRepository<Order> _orderRepository;
        private readonly IRepository<OrderItem> _orderItemRepository;
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IRepository<Planwork> _planworkRepository;
        private readonly IRepository<Enrollment> _enrollmentRepository;

        public CheckoutService(
            IRepository<AppUser> userRepository,
            IRepository<Cart> cartRepository,
            IRepository<CartItem> cartItemRepository,
            IRepository<Order> orderRepository,
            IRepository<OrderItem> orderItemRepository,
            IRepository<Payment> paymentRepository,
            IRepository<Planwork> planworkRepository,
            IRepository<Enrollment> enrollmentRepository
            )
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _paymentRepository = paymentRepository;
            _planworkRepository = planworkRepository;
            _enrollmentRepository = enrollmentRepository;
        }
        public async Task<AppUser> GetUserByClerkIdAsync(string clerkUserId)
        {
            var spec = new BaseSpecification<AppUser>(u => u.ClerkUserId == clerkUserId);
            return (await _userRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();
        }

        public async Task<Order> CreateOrderAsync(int userId)
        {
            var spec = new BaseSpecification<Cart>(c => c.UserId == userId && !c.IsCheckedOut);
            spec.AddInclude(c => c.Items);
            var cart = (await _cartRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();

            if (cart == null || !cart.Items.Any())
                throw new Exception("Cart is empty");

            var total = cart.Items.Sum(i => i.Price);

            var order = new Order
            {
                UserId = userId,
                TotalAmount = total,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync(); // عشان نجيب order.Id

            foreach (var item in cart.Items)
            {
                await _orderItemRepository.AddAsync(new OrderItem
                {
                    OrderId = order.Id,
                    PlanworkId = item.PlanworkId,
                    Price = item.Price
                });
            }

            // 🔥 Create Payment Pending هنا
            var payment = new Payment
            {
                OrderId = order.Id,
                Amount = total,
                Method = PaymentMethod.Visa,
                Status = PaymentStatus.Pending
            };

            await _paymentRepository.AddAsync(payment);

            // 🔥 اقفل الكارت
            cart.IsCheckedOut = true;
            _cartRepository.Update(cart);

            await _orderRepository.SaveChangesAsync();

            return order;
        }

        public async Task<Payment> ProcessPaymentAsync(int orderId,string transactionRef,string gatewayResponse,bool success)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
                throw new Exception("Order not found");

            // 🔥 حماية من إعادة التنفيذ
            if (order.Status == OrderStatus.Paid)
                return (await _paymentRepository
                    .GetAllWithSpecAsync(
                        new BaseSpecification<Payment>(p => p.OrderId == orderId)))
                    .FirstOrDefault();

            var paymentSpec = new BaseSpecification<Payment>(p => p.OrderId == orderId);
            var payment = (await _paymentRepository.GetAllWithSpecAsync(paymentSpec))
                .FirstOrDefault();

            if (payment == null)
                throw new Exception("Payment not found");

            payment.TransactionRef = transactionRef;
            payment.GatewayResponse = gatewayResponse;
            payment.PaymentDate = DateTime.UtcNow;

            if (success)
            {
                payment.Status = PaymentStatus.Success;
                order.Status = OrderStatus.Paid;

                // 🔥 نجيب OrderItems
                var orderItemsSpec =
                    new BaseSpecification<OrderItem>(o => o.OrderId == orderId);

                var items =
                    await _orderItemRepository.GetAllWithSpecAsync(orderItemsSpec);

                foreach (var item in items)
                {
                    // 🔥 منع Duplicate Enrollment
                    var existingSpec = new BaseSpecification<Enrollment>(
                        e => e.UserId == order.UserId &&
                             e.PlanworkId == item.PlanworkId);

                    var exists = (await _enrollmentRepository
                        .GetAllWithSpecAsync(existingSpec)).Any();

                    if (!exists)
                    {
                        await _enrollmentRepository.AddAsync(new Enrollment
                        {
                            UserId = order.UserId,
                            PlanworkId = item.PlanworkId,
                            OrderId = orderId,
                            EnrolledAt = DateTime.UtcNow
                        });
                    }
                }
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
                order.Status = OrderStatus.Cancelled;
            }

            _paymentRepository.Update(payment);
            _orderRepository.Update(order);

            await _orderRepository.SaveChangesAsync();

            return payment;
        }

    }
}
