using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Course;
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
        private readonly IRepository<Certificate> _certificateRepository;

        public AdminService(IRepository<AppUser> userRepository,IRepository<Enrollment> enrollmentRepository, IRepository<Planwork> planworkRepository ,IRepository<Certificate> certificateRepository)
        {
            _userRepository = userRepository;
            _enrollmentRepository = enrollmentRepository;
            _planworkRepository = planworkRepository;
            _certificateRepository = certificateRepository;
        }
        public async Task<IReadOnlyList<UserWithCoursesDto>> GetAllUsersAsync(UserSpecParams param)
        {
            // Spec مع keyword + date filters
            var spec = new UserSearchSpec(param);

            // جلب البيانات من الريبو
            var users = await _userRepository.GetAllWithSpecAsync(spec);

            return users.Select(u => new UserWithCoursesDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CoursesCount = u.Enrollments
                    .Count(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value)),
                Courses = u.Enrollments
                    .Where(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value))
                    .Select(e => new UserCourseDto
                    {
                        Title = e.Planwork.ServiceTitle,
                        EnrolledAt = e.EnrolledAt
                    })
                    .ToList()
            }).ToList();
        }


      
        public async Task<IReadOnlyList<PlanworkWithUsersDto>> GetAllPlanworksAsync(PlanworkSpecParams param)
        {
            var spec = new PlanworkSearchSpec(param);

            var planworks = await _planworkRepository.GetAllWithSpecAsync(spec);

            return planworks.Select(p =>
            {
                // فلترة الـ enrollments حسب التاريخ
                var filteredEnrollments = p.Enrollments
                    .Where(e =>
                        (!param.FromDate.HasValue || e.EnrolledAt >= param.FromDate.Value) &&
                        (!param.ToDate.HasValue || e.EnrolledAt <= param.ToDate.Value))
                    .ToList();

                return new PlanworkWithUsersDto
                {
                    Id = p.ChildId,
                    ServiceTitle = p.ServiceTitle,
                    UsersCount = filteredEnrollments.Count,
                    Users = filteredEnrollments.Select(e => new UserEnrollmentDto
                    {
                        Username = e.User.Username,
                        Email = e.User.Email,
                        EnrolledAt = e.EnrolledAt
                    }).ToList()
                };
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
                CertificatesCount = await _certificateRepository.CountAsync(),
                //RefundsCount = await _unitOfWork.Repository<Refund>().CountAsync()
            };
        }

        public async Task<bool> UploadCertificateAsync(UploadCertificateDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return false;

            var exists = await _certificateRepository
                .AnyAsync(x => x.UserId == dto.UserId && x.PlanworkId == dto.PlanworkId);

            if (exists)
                return false;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/certificates");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var certificate = new Certificate
            {
                UserId = dto.UserId,
                PlanworkId = dto.PlanworkId,
                FileUrl = "/certificates/" + fileName,
                FileName = dto.File.FileName,
                FileSizeBytes = dto.File.Length,
                UploadedAt = DateTime.UtcNow
            };

            await _certificateRepository.AddAsync(certificate);
            await _certificateRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAttendanceAsync(int enrollmentId, bool attended)
        {
            // جلب الـ enrollment
            var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);
            if (enrollment == null)
                return false;

            // تحديث الحضور
            enrollment.Attended = attended;

            // حفظ التغييرات
            await _enrollmentRepository.SaveChangesAsync();
            return true;
        }


    }
}
