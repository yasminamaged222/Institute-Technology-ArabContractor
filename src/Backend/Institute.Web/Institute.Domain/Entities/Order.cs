using Institute.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public string OrderNumber { get; set; } = Guid.NewGuid().ToString("N"); // Public Ref

        public int UserId { get; set; }
        public AppUser User { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public string? SuccessIndicator { get; set; }  // Gateway validation
        public string? GatewaySessionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
