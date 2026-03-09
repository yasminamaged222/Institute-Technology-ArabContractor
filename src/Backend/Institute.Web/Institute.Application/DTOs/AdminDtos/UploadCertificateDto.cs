using Microsoft.AspNetCore.Http;

namespace Institute.Application.DTOs.AdminDtos
{
    public class UploadCertificateDto
    {
        public int UserId { get; set; }

        public int PlanworkId { get; set; }

        public IFormFile File { get; set; } = null!;
    }
}
