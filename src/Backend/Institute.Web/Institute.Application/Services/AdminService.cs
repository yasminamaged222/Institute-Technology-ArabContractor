using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec;
using Institute.Domain.specifications.AdminSpec.Certificates;
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
        private readonly IRepository<RefundRequest> _refundRepository;

        public AdminService(IRepository<AppUser> userRepository,IRepository<Enrollment> enrollmentRepository, IRepository<Planwork> planworkRepository ,IRepository<Certificate> certificateRepository,IRepository<RefundRequest> refundRepository)
        {
            _userRepository = userRepository;
            _enrollmentRepository = enrollmentRepository;
            _planworkRepository = planworkRepository;
            _certificateRepository = certificateRepository;
            _refundRepository = refundRepository;

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
                        EnrollmentId = e.Id,           // ← أضف
                        Title = e.Planwork.ServiceTitle,
                        EnrolledAt = e.EnrolledAt,
                        Attended = e.Attended
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
            var coursesSpec = new PlanworkCount();
            var attendedSpec = new AttendedEnrollmentsSpec();
            return new AdminStatsDto
            {
                UsersCount = await _userRepository.CountAsync(),
                PlanworksCount = await _planworkRepository
                                            .GetCountAsync(coursesSpec),
                EnrollmentsCount = await _enrollmentRepository.CountAsync(),
                AttendanceCount = await _enrollmentRepository
                                                .GetCountAsync(attendedSpec), 
                CertificatesCount = await _certificateRepository.CountAsync(),
                RefundsCount = await _refundRepository.CountAsync()
            };
        }

        public async Task<bool> UploadCertificateAsync(UploadCertificateDto dto, string uploadsFolder)
        {
            if (dto.File == null || dto.File.Length == 0)
                return false;

            var exists = await _certificateRepository
                .AnyAsync(x => x.UserId == dto.UserId && x.PlanworkId == dto.PlanworkId);

            if (exists)
                return false;

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
                FileUrl = "/api/Admin/certificates/download/" + fileName, // ✅ URL مش path
                FileName = dto.File.FileName,
                FileSizeBytes = dto.File.Length,
                UploadedAt = DateTime.UtcNow
            };

            await _certificateRepository.AddAsync(certificate);
            await _certificateRepository.SaveChangesAsync();
            return true;
        }

        public async Task<CertificateDto?> GetCertificateAsync(int userId, int planworkId)
        {
            var spec = new CertificateWithUserAndPlanworkSpec(userId, planworkId);

            var certificate = await _certificateRepository.GetByIdWithSpecAsync(spec);

            if (certificate == null)
                return null;

            return new CertificateDto
            {
                Id = certificate.Id,
                UserId = certificate.UserId,
                Username = certificate.User.Username,
                PlanworkId = certificate.PlanworkId,
                PlanworkTitle = certificate.Planwork.ServiceTitle,
                FileUrl = certificate.FileUrl,
                FileName = certificate.FileName,
                UploadedAt = certificate.UploadedAt
            };
        }

        public async Task<CertificateDto?> GetCertificateByClerkIdAsync(string clerkId, int planworkId)
        {
            // 1. get user from ClerkId
            var user = await _userRepository
                .GetByIdWithSpecAsync(new UserByClerkIdSpec(clerkId));

            if (user == null)
                return null;

            // 2. get certificate using DB userId
            var spec = new CertificateWithUserAndPlanworkSpec(user.Id, planworkId);
            var certificate = await _certificateRepository.GetByIdWithSpecAsync(spec);

            if (certificate == null)
                return null;

            // 3. map to DTO
            return new CertificateDto
            {
                Id = certificate.Id,
                UserId = certificate.UserId,
                Username = certificate.User.Username,
                PlanworkId = certificate.PlanworkId,
                PlanworkTitle = certificate.Planwork.ServiceTitle,
                FileUrl = certificate.FileUrl,
                FileName = certificate.FileName,
                UploadedAt = certificate.UploadedAt
            };
        }
        public async Task<bool> UpdateCertificateAsync(UpdateCertificateDto dto, string uploadsFolder)
        {
            var certificate = await _certificateRepository.GetByIdAsync(dto.CertificateId);
            if (certificate == null) return false;

            // حذف الملف القديم
            if (!string.IsNullOrEmpty(certificate.FileUrl))
            {
                var oldFileName = Path.GetFileName(certificate.FileUrl);
                var oldPath = Path.Combine(uploadsFolder, oldFileName);
                if (File.Exists(oldPath))
                    File.Delete(oldPath);
            }

            // حفظ الملف الجديد
            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            // ✅ نفس الـ URL format بتاع الـ Upload
            certificate.FileUrl = "/api/Admin/certificates/download/" + fileName;
            certificate.FileName = dto.File.FileName;
            certificate.FileSizeBytes = dto.File.Length;
            certificate.UploadedAt = DateTime.UtcNow;

            _certificateRepository.Update(certificate);
            await _certificateRepository.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteCertificateAsync(int certificateId, string uploadsFolder)
        {
            var certificate = await _certificateRepository.GetByIdAsync(certificateId);

            if (certificate == null)
                return false;

            // 🗑️ delete file from server
            if (!string.IsNullOrEmpty(certificate.FileUrl))
            {
                var fileName = Path.GetFileName(certificate.FileUrl);
                var filePath = Path.Combine(uploadsFolder, fileName);

                if (File.Exists(filePath))
                    File.Delete(filePath);
            }

            // 🗑️ delete from DB
            _certificateRepository.Delete(certificate);
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
        public async Task<IReadOnlyList<EnrollmentWithCertificateDto>> GetEnrollmentsWithCertificatesAsync()
        {
            var enrollments = await _enrollmentRepository.GetAllAsync();

            var result = new List<EnrollmentWithCertificateDto>();

            foreach (var e in enrollments)
            {
                var hasCertificate = await _certificateRepository.AnyAsync(
                    c => c.UserId == e.UserId && c.PlanworkId == e.PlanworkId);

                result.Add(new EnrollmentWithCertificateDto
                {
                    EnrollmentId = e.Id,
                    UserId = e.UserId,
                    Username = e.User.Username,
                    PlanworkId = e.PlanworkId,
                    PlanworkTitle = e.Planwork.ServiceTitle,
                    Attended = e.Attended,
                    HasCertificate = hasCertificate
                });
            }

            return result;
        }
        public async Task<IReadOnlyList<CertificateDto>> GetAllCertificatesAsync()
        {
            // 🔹 جيب كل الشهادات
            var certSpec = new AllCertificateWithUserAndPlanworkSpec();
            var certificates = await _certificateRepository.GetAllWithSpecAsync(certSpec);

            // 🔹 حطهم في Dictionary علشان البحث السريع
            var certDict = certificates.ToDictionary(
                c => (c.UserId, c.PlanworkId),
                c => c);

            // 🔹 جيب كل الـ enrollments مع user + planwork
            var enrollSpec = new EnrollmentWithUserAndPlanworkSpec();
            var enrollments = await _enrollmentRepository.GetAllWithSpecAsync(enrollSpec);

            // 🔥 ارجع نتيجة لكل enrollment
            return enrollments.Select(e =>
            {
                certDict.TryGetValue((e.UserId, e.PlanworkId), out var cert);

                return new CertificateDto
                {
                    Id = cert?.Id ?? 0,
                    UserId = e.UserId,
                    Username = e.User.Username,

                    PlanworkId = e.PlanworkId,
                    PlanworkTitle = e.Planwork.ServiceTitle,

                    FileUrl = cert?.FileUrl,
                    FileName = cert?.FileName,

                    UploadedAt = cert?.UploadedAt ?? DateTime.MinValue
                };
            }).ToList();
        }

    }
}
