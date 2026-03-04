using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class UserCourseDto
    {
        public string Title { get; set; } = null!;
        public DateTime EnrolledAt { get; set; }
    }
}
