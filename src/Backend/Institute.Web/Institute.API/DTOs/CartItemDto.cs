namespace Institute.API.DTOs
{
    public class CartItemDto
    {
        public int PlanworkId { get; set; }
        public decimal Price { get; set; }

        // بيانات الكورس من Planwork
        public string? Title { get; set; }
        public string? CourseName { get => Title; set => Title = value; }
        public string? Place { get; set; }
        public string? Date { get; set; }
        public string? Days { get; set; }
        public decimal? Cost { get; set; }
        public decimal? OriginalPrice { get => Cost; set => Cost = value; }
        public string? Slug { get; set; }
        public string? CourseImage { get; set; }

        // حسابات الخصم (Cost هو السعر الأصلي، Price هو السعر بعد الخصم)
        public decimal DiscountAmount => (Cost ?? Price) - Price;
        public decimal DiscountPercent => (Cost ?? 0) > 0
            ? Math.Round((DiscountAmount / Cost!.Value) * 100, 2)
            : 0;
    }
}