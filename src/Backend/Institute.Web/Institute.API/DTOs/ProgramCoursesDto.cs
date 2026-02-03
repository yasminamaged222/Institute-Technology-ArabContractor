namespace Institute.API.DTOs
{
    public class ProgramCoursesDto
    {
        public int ProgramId { get; set; }
        public string? ProgramName { get; set; }
        public List<CourseCardDto> Courses { get; set; } = new();
    }
}
