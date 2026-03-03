using Institute.API.DTOs.AdminDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IAdminService
    {
        Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync();
        Task<IReadOnlyList<UserWithCoursesDto>> SearchUsersAsync(string keyword);
    }
}
