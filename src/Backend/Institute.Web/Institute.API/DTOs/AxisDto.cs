namespace Institute.API.DTOs
{
    public class AxisDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<CourseDto> Courses { get; set; } = new();
    }
}
