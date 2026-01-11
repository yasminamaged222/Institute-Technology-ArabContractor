namespace Institute.Domain.Entities
{
    public class CoursePurchase
    {
        public int Id { get; set; }
        public int UserId { get; set; }         // Foreign key to AppUser
        public int PlanworkId { get; set; }     // Foreign key to Planwork (optional, depending on your logic)
        public DateTime PurchaseDate { get; set; } = DateTime.Now;
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Pending";

        // Navigation Properties
        public virtual AppUser User { get; set; } = null!;
        // لو عايز تربطها بالـ Planwork:
        // public virtual Planwork Planwork { get; set; } = null!;
    }
}