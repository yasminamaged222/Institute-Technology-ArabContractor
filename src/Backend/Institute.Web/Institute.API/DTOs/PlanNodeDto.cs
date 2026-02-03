namespace Institute.API.DTOs
{
    public class PlanNodeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // Course data (only for leaf nodes)
        public DateTime? CourseDate { get; set; }
        public string CoursePlace { get; set; }
        public string CourseContent { get; set; }

        public List<PlanNodeDto> Children { get; set; } = new();
    }

}
