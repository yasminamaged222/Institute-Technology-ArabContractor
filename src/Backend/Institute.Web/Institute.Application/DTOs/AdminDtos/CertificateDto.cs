using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class CertificateDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }

        public int PlanworkId { get; set; }
        public string PlanworkTitle { get; set; }

        public string FileUrl { get; set; }
        public string FileName { get; set; }

        public DateTime UploadedAt { get; set; }
    }
}
