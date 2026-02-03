namespace Institute.API.DTOs
{
    public class TrainingPlanResponseDto
    {
        public string? Title { get; set; }
        public List<CategoryDto> Categories { get; set; } = new();
    }
}
