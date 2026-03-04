namespace Institute.Domain.Entities
{
    public class Certificate
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;

        public int PlanworkId { get; set; }
        public Planwork Planwork { get; set; } = null!;

        /// <summary>
        /// Relative path or URL to the uploaded certificate file
        /// </summary>
        public string FileUrl { get; set; } = null!;

        public string FileName { get; set; } = null!;

        public long FileSizeBytes { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}