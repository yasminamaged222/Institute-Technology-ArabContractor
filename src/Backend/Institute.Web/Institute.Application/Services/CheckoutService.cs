using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications;
using Microsoft.EntityFrameworkCore;
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
        #region oldCode
        //public async Task<Order> CreateOrderAsync(int userId)
        //{
        //    var spec = new BaseSpecification<Cart>(c => c.UserId == userId && !c.IsCheckedOut);
        //    spec.AddInclude(c => c.Items);
        //    var cart = (await _cartRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();

        //    if (cart == null || !cart.Items.Any())
        //        throw new Exception("Cart is empty");

        //    var total = cart.Items.Sum(i => i.Price);

        //    var order = new Order
        //    {
        //        UserId = userId,
        //        TotalAmount = total,
        //        Status = OrderStatus.Pending,
        //        CreatedAt = DateTime.UtcNow
        //    };

        //    await _orderRepository.AddAsync(order);
        //    await _orderRepository.SaveChangesAsync(); // عشان نجيب order.Id

        //    foreach (var item in cart.Items)
        //    {
        //        await _orderItemRepository.AddAsync(new OrderItem
        //        {
        //            OrderId = order.Id,
        //            PlanworkId = item.PlanworkId,
        //            Price = item.Price
        //        });
        //    }

        //    // 🔥 Create Payment Pending هنا
        //    var payment = new Payment
        //    {
        //        OrderId = order.Id,
        //        Amount = total,
        //        Method = PaymentMethod.Visa,
        //        Status = PaymentStatus.Pending
        //    };

        //    await _paymentRepository.AddAsync(payment);

        //    // 🔥 اقفل الكارت
        //    cart.IsCheckedOut = true;
        //    _cartRepository.Update(cart);

        //    await _orderRepository.SaveChangesAsync();

        //    return order;
        //}
        #endregion

        //NewCODE 
        public async Task UpdateOrderGatewayDataAsync(Order order)
        {
            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }
        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            var spec = new BaseSpecification<Order>(o => o.Id == orderId);
            spec.AddInclude(o => o.Items);
            spec.AddInclude("Items.Planwork"); // for CourseTitle in refund response

            return (await _orderRepository.GetAllWithSpecAsync(spec))
                .FirstOrDefault();
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
            await _orderRepository.SaveChangesAsync(); // عشان نجيب Id

            foreach (var item in cart.Items)
            {
                await _orderItemRepository.AddAsync(new OrderItem
                {
                    OrderId = order.Id,
                    PlanworkId = item.PlanworkId,
                    Price = item.Price
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

            cart.IsCheckedOut = true;
            _cartRepository.Update(cart);

            // ✅ Save once for everything
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

            // 1️⃣ جيب الـ Payment الموجود بدل ما تعمل جديد
            var paymentSpec = new BaseSpecification<Payment>(p => p.OrderId == order.Id);
            var payment = (await _paymentRepository.GetAllWithSpecAsync(paymentSpec)).FirstOrDefault();

            if (payment == null)
                throw new Exception("Payment record not found for this order.");

            // 2️⃣ Update الـ Payment الموجود
            payment.Status = PaymentStatus.Success;
            payment.TransactionRef = transactionRef;
            payment.GatewayResponse = gatewayResponse;
            payment.PaymentDate = DateTime.UtcNow;
            payment.Method = PaymentMethod.Visa;
            _paymentRepository.Update(payment);

            // 3️⃣ Update الـ Order
            order.Status = OrderStatus.Paid;
            _orderRepository.Update(order);

            // 4️⃣ Enrollments
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
                        EnrolledAt = DateTime.UtcNow
                    });
                }
            }

            // 5️⃣ Save everything
            await _orderRepository.SaveChangesAsync();

            return payment;
        }


        public async Task<Payment> ProcessPaymentAsync(int orderId, string transactionRef, string gatewayResponse, bool success)
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