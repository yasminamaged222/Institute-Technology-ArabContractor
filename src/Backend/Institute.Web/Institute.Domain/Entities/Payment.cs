using Institute.Domain.Enums;

namespace Institute.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public decimal Amount { get; set; }

        public PaymentMethod Method { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? TransactionRef { get; set; } // Gateway transaction id
        public string? GatewayResponse { get; set; } // Optional JSON log

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaymentDate { get; set; }

    }
}