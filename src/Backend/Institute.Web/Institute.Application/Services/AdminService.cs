using Institute.API.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRepository<AppUser> _userRepository;

        public AdminService(IRepository<AppUser> userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync()
        {
            var spec = new UsersWithEnrollmentsSpec();

            var users = await _userRepository
                                         .GetAllWithSpecAsync(spec);

            return users.Select(u => new UserWithCoursesDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CoursesCount = u.Enrollments.Count,
                Courses = u.Enrollments
                            .Select(e => e.Planwork.ServiceTitle)
                            .ToList()
            }).ToList();
        }
        public async Task<IReadOnlyList<UserWithCoursesDto>> SearchUsersAsync(string keyword)
        {
            var spec = new UserSearchSpec(keyword);

            var users = await _userRepository
                                         .GetAllWithSpecAsync(spec);

            return users.Select(u => new UserWithCoursesDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CoursesCount = u.Enrollments.Count,
                Courses = u.Enrollments
                            .Select(e => e.Planwork.ServiceTitle)
                            .ToList()
            }).ToList();
        }
    }
}
