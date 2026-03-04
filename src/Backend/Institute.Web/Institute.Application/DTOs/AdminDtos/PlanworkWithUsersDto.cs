using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.DTOs.AdminDtos
{
    public class PlanworkWithUsersDto
    {
        public int Id { get; set; }
        public string? ServiceTitle { get; set; }
        public string? Category { get; set; } // you can map from Planwork.MainFlag / some property
        public int UsersCount { get; set; }
        public List<UserEnrollmentDto> Users { get; set; } = new();
    }
}
