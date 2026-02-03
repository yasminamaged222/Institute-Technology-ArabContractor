using Institute.API.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [ApiController]
    [Route("api/payments/bankmisr")]
    public class BankMisrPaymentsController : ControllerBase
    {
        private readonly BankMisrPaymentService _bank;
         // عندك بالفعل

        


        private readonly IRepository<Order> _orders;
        private readonly IRepository<OrderItem> _orderItems;
        private readonly IRepository<Planwork> _planworks;

        public BankMisrPaymentsController(
            IRepository<Order> orders,
            IRepository<OrderItem> orderItems,
            IRepository<Planwork> planworks)
        {
            _orders = orders;
            _orderItems = orderItems;
            _planworks = planworks;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            if (dto.PlanworkIds == null || !dto.PlanworkIds.Any())
                return BadRequest("No items selected");

            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var planworkId in dto.PlanworkIds)
            {
                var planwork = await _planworks.GetByIdAsync(planworkId);
                if (planwork == null)
                    return BadRequest($"Invalid planwork id: {planworkId}");

                if (planwork.PlanCost == null)
                    return BadRequest($"Planwork {planworkId} has no price");

                totalAmount += planwork.PlanCost.Value;

                orderItems.Add(new OrderItem
                {
                    PlanworkId = planwork.ChildId,
                    Price = planwork.PlanCost.Value
                });
            }

            var order = new Order
            {
                UserId = dto.UserId,
                TotalAmount = totalAmount,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _orders.AddAsync(order);

            foreach (var item in orderItems)
            {
                item.OrderId = order.Id;
                await _orderItems.AddAsync(item);
            }

            return Ok(new
            {
                orderId = order.Id,
                totalAmount = order.TotalAmount,
                status = order.Status.ToString()
            });
        }





        [HttpPost("start")]
        public async Task<IActionResult> StartPayment(int orderId)
        {
            var order = await _orders.GetByIdAsync(orderId);

            if (order == null)
                return NotFound("Order not found");

            // ✅ Only Pending orders can be paid
            if (order.Status != OrderStatus.Pending)
                return BadRequest("Order cannot be paid");

            // ✅ Call Bank Misr
            var sessionId = await _bank.CreateCheckoutSessionAsync(
                order.Id.ToString(),          // Order reference
                order.TotalAmount,            // Amount
                "EGP"                         // Currency
            );

            return Ok(new { sessionId });
        }
    }
}
