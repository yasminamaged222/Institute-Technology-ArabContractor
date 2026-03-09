using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IAdminService
    {
        Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync(UserSpecParams param);
        //Task<IReadOnlyList<UserWithCoursesDto>> SearchUsersAsync(string keyword, DateTime? fromDate, DateTime? toDate);
        //Task<IReadOnlyList<PlanworkWithUsersDto>> SearchPlanworksAsync(string keyword, DateTime? fromDate, DateTime? toDate);
        Task<IReadOnlyList<PlanworkWithUsersDto>> GetAllPlanworksAsync(PlanworkSpecParams param);
        Task<AdminStatsDto> GetStatsAsync();
        Task<bool> UploadCertificateAsync(UploadCertificateDto dto);

    }
}
