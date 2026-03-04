using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.PlanworkSpec;
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
        private readonly IRepository<Enrollment> _enrollmentRepository;
        private readonly IRepository<Planwork> _planworkRepository;

        public AdminService(IRepository<AppUser> userRepository,IRepository<Enrollment> enrollmentRepository, IRepository<Planwork> planworkRepository)
        {
            _userRepository = userRepository;
            _enrollmentRepository = enrollmentRepository;
            _planworkRepository = planworkRepository;
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
                            .Select(e => new UserCourseDto
                            {
                                Title = e.Planwork.ServiceTitle,
                                EnrolledAt = e.EnrolledAt
                            })
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
                            .Select(e => new UserCourseDto
                            {
                                Title = e.Planwork.ServiceTitle,
                                EnrolledAt = e.EnrolledAt
                            })
                            .ToList()
            }).ToList();
        }
        public async Task<IReadOnlyList<PlanworkWithUsersDto>> GetAllPlanworksAsync()
        {
            // Load Planworks with Enrollments and Users
            var planworks = await _planworkRepository.GetAllWithSpecAsync(new PlanworksWithEnrollmentsSpec());

            return planworks.Select(p => new PlanworkWithUsersDto
            {
                Id = p.ChildId,
                ServiceTitle = p.ServiceTitle,
                Category = p.MainFlag == true ? "Main" : "Other", // example
                UsersCount = p.Enrollments.Count,
                Users = p.Enrollments.Select(e => new UserEnrollmentDto
                {
                    Username = e.User.Username,
                    Email = e.User.Email,
                    EnrolledAt = e.EnrolledAt
                }).ToList()
            }).ToList();
        }
        public async Task<AdminStatsDto> GetStatsAsync()
        {
            return new AdminStatsDto
            {
                UsersCount = await _userRepository.CountAsync(),
                PlanworksCount = await _planworkRepository.CountAsync(),
                EnrollmentsCount = await _enrollmentRepository.CountAsync(),
                //AttendanceCount = await _unitOfWork.Repository<Attendance>().CountAsync(),
                //CertificatesCount = await _unitOfWork.Repository<Certificate>().CountAsync(),
                //RefundsCount = await _unitOfWork.Repository<Refund>().CountAsync()
            };
        }
    }
}
