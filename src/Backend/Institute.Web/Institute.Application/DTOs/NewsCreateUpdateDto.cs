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
        public int? Id { get; set; }

        public string Title { get; set; }
        public string Details { get; set; }
        public DateTime Date { get; set; }

        public IFormFile? Image { get; set; }  // 👈 فقط ده من العميل
        public string ImageUrl { get; set; }
    }
}
