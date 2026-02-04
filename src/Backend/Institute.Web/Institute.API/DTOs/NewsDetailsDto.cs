namespace Institute.API.DTOs
{
    public class NewsDetailsDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Details { get; set; }
        public DateTime PublishedAt { get; set; }
        public string? ImageUrl { get; set; }
    }


}
