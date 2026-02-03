namespace Institute.API.DTOs
{
    public class ProgramDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public List<CourseDto> Courses { get; set; } = new();
    }
}
