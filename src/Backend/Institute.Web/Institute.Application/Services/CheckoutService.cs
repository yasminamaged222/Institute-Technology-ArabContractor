using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
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
            // نجيب الـ cart بتاع الـ user
            var spec = new BaseSpecification<Cart>(c => c.UserId == userId);
            spec.AddInclude(c => c.Items); // عشان تجيب CartItems
            var cart = (await _cartRepository.GetAllWithSpecAsync(spec)).FirstOrDefault();

            if (cart == null || cart.Items.Count == 0)
                throw new Exception("Cart is empty");

            // نعمل Order
            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                OrderNumber = Guid.NewGuid().ToString().Replace("-", "").ToUpper()
            };

            await _orderRepository.AddAsync(order);

            // نعمل OrderItems
            foreach (var item in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    PlanworkId = item.PlanworkId,
                    Price = item.Price
                };
                await _orderItemRepository.AddAsync(orderItem);
            }

            return order;
        }

        public async Task<Payment> ProcessPaymentAsync(int orderId, string transactionRef, string gatewayResponse, bool success)
        {
            // 1. نجيب الـ order
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Order not found");

            // 2. نعمل Payment
            var payment = new Payment
            {
                OrderId = orderId,
                TransactionRef = transactionRef,
                GatewayResponse = gatewayResponse,
                CreatedAt = DateTime.UtcNow
            };
            await _paymentRepository.AddAsync(payment);

            // 3. لو ناجحة، نعمل Enrollments
            if (success)
            {
                // نجيب كل order items
                var spec = new BaseSpecification<OrderItem>(oi => oi.OrderId == orderId);
                var items = await _orderItemRepository.GetAllWithSpecAsync(spec);

                foreach (var item in items)
                {
                    var enrollment = new Enrollment
                    {
                        UserId = order.UserId,
                        PlanworkId = item.PlanworkId,
                        OrderId = orderId,
                        EnrolledAt = DateTime.UtcNow
                    };
                    await _enrollmentRepository.AddAsync(enrollment);
                }

                // تحديث الـ order
                order.SuccessIndicator = "SUCCESS";
                _orderRepository.Update(order);
            }
            else
            {
                order.SuccessIndicator = "FAILED";
                _orderRepository.Update(order);
            }

            return payment;
        }
    }
}
