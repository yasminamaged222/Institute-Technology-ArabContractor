namespace Institute.API.DTOs
{
    public class ProgramTypeDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        // ✅ في البرامج العامة هنستخدم Axes
        public List<AxisDto> Axes { get; set; } = new();

        // ✅ في البرامج التأهيلية
        public List<ProgramDto> Programs { get; set; } = new();
    }
}
