namespace Institute.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int UserId { get; set; }                 // Foreign key to AppUser
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public string PaymentMethod { get; set; } = null!;
        public int TransactionId { get; set; }
        public string Status { get; set; } = "Pending";

        // Navigation Property
        public virtual AppUser User { get; set; } = null!;
    }
}