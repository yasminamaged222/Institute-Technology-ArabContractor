namespace Institute.API.DTOs
{
    public class CategoryTreeDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public List<CategoryTreeDto> Children { get; set; } = new();
    }
}
