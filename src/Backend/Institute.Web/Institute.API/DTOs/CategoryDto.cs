namespace Institute.API.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string? Slug { get; set; }
        public string? Name { get; set; }
        public List<ProgramTypeDto> ProgramTypes { get; set; } = new();
    }
}
