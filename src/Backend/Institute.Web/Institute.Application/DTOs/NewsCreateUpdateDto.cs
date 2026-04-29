using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs
{
    public class NewsCreateUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;      // → ATitel
        public string Details { get; set; } = null!;    // → ADetails
        public DateTime Date { get; set; }              // → NewsDate
        public IFormFile? Image { get; set; }           // صورة اختيارية → NewsPic
        public string ImageUrl { get; set; }
    }
}
