namespace Institute.Domain.Entities
{
    /// <summary>
    /// Stores refund requests submitted by users.
    /// Status values match AdminDashboard.jsx exactly:
    ///   "pending" | "approved" | "sent_to_bank" | "rejected"
    /// </summary>
    public class RefundRequest
    {
        public int Id { get; set; }

        // Human-readable ref e.g. "REF-2025-001"
        public string RefNumber { get; set; } = string.Empty;

        // Relations
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        // The specific course the user wants a refund for
        public int PlanworkId { get; set; }
        public Planwork Planwork { get; set; } = null!;

        // Amount
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "EGP";

        // Reason (submitted by user)
        public string Reason { get; set; } = string.Empty;
        public string? Details { get; set; }

        // Status: "pending" | "approved" | "sent_to_bank" | "rejected"
        public string Status { get; set; } = "pending";

        // Bank info (submitted by user)
        public string? BankName { get; set; }
        public string? AccountNumber { get; set; }
        public string? AccountHolder { get; set; }
        public string? Iban { get; set; }

        // Admin audit
        public string? AdminNote { get; set; }
        public string? RejectionReason { get; set; }

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public DateTime? RejectedAt { get; set; }
    }
}