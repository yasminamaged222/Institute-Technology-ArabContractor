namespace Institute.API.DTOs
{
    public class CartDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CartItemDto> Items { get; set; } = new();

        // Totals محسوبة جاهزة للـ Frontend
        public decimal Subtotal => Items.Sum(i => i.Cost ?? i.Price);
        public decimal TotalDiscount => Items.Sum(i => i.DiscountAmount);
        public decimal Total => Items.Sum(i => i.Price);
        public int ItemCount => Items.Count;
    }
}