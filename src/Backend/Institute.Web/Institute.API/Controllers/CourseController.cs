using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
using Institute.Domain.specifications.CourseSpec;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Planwork> _planRepo;
        private readonly IRepository<PlanFile> _fileRepo;
        private readonly IRepository<Enrollment> _enrollmentRepo;
        private readonly IClerkService _clerkService;
        private readonly IRepository<AppUser> _userRepo;
        private readonly ICategoryService _categoryService;
        private readonly IRepository<Order> _orderRepo;


        public CourseController(
            IRepository<Planwork> planRepo,
            IRepository<PlanFile> fileRepo,
            IRepository<Enrollment> enrollmentRepo,
            IClerkService clerkService,
            IRepository<AppUser> userRepo,
            ICategoryService categoryService,
            IRepository<Order> orderRepo)
        {
            _planRepo = planRepo;
            _fileRepo = fileRepo;
            _enrollmentRepo = enrollmentRepo;
            _clerkService = clerkService;
            _userRepo = userRepo;
            _categoryService = categoryService;
            _orderRepo = orderRepo;
        }


        [HttpGet("programs/{slug}/courses")]
        public async Task<IActionResult> GetProgramCourses(string slug)
        {
            // ✅ هات كل الداتا مرة واحدة
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var files = (await _fileRepo.GetAllAsync()).ToList();

            // ✅ تأكد إن الـ Program / Axis موجود
            var program = planworks.FirstOrDefault(x => x.Slug == slug);
            if (program == null)
                return NotFound();
            var programId = program.ChildId;
            // ✅ جمع الكورسات Recursive (نفس Logic الـ Builder)
            var courses = GetCoursesRecursive(planworks, files, programId);

            // ✅ Response النهائي (Cards)
            return Ok(new ProgramCoursesDto
            {
                ProgramId = program.ChildId,
                Slug = program.Slug,
                ProgramName = program.ServiceTitle,
                Courses = courses
                    .OrderBy(c => c.Id) // أو Priority لو حابب
                    .ToList()
            });
        }


        // =========================================================
        // RECURSIVE COURSE COLLECTOR (WITH LOOP PROTECTION ✅)
        // =========================================================
        private List<CourseCardDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId)
        {
            return GetCoursesRecursive(
                planworks,
                files,
                parentId,
                new HashSet<int>()
            );
        }

        private List<CourseCardDto> GetCoursesRecursive(
            List<Planwork> planworks,
            List<PlanFile> files,
            int parentId,
            HashSet<int> visited)
        {
            var result = new List<CourseCardDto>();

            // ✅ منع Loop
            if (visited.Contains(parentId))
                return result;

            visited.Add(parentId);

            // ✅ كورسات مباشرة
            var directCourses = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.DetailsFlag == false &&
                    x.CourseDate != null
                )
                .OrderBy(x => x.Priority)
                .Select(c => new CourseCardDto
                {
                    Id = c.ChildId,
                    Slug = c.Slug,
                    Title = c.ServiceTitle,
                    Place = c.CoursePlace,
                    Date = c.CourseDate,
                    Description = c.CourseDesc,
                    Cost = c.PlanCost

                })
                .ToList();

            result.AddRange(directCourses);

            // ✅ Children تنظيمية (محاور / عناوين)
            var childrenIds = planworks
                .Where(x =>
                    x.ParentId == parentId &&
                    x.CourseDate == null
                )
                .Select(x => x.ChildId)
                .ToList();

            foreach (var childId in childrenIds)
            {
                result.AddRange(
                    GetCoursesRecursive(planworks, files, childId, visited)
                );
            }

            return result;

        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetCourseById(string slug)
        {
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var files = (await _fileRepo.GetAllAsync()).ToList();

            // =========================
            // find course
            // =========================
            var course = planworks.FirstOrDefault(x =>
                x.Slug == slug &&
                x.DetailsFlag == false &&
                x.CourseDate != null
            );

            if (course == null)
                return NotFound();

            // =========================
            // files mapping (from PlanFile)
            // =========================
            var courseFiles = files
                .Where(f => f.PlanId == course.ChildId)
                .OrderBy(f => f.FilePeriorty)
                .Select(f => new CourseFileDto
                {
                    Title = f.FileTitle,
                    FileName = f.FileName
                })
                .ToList();

            // =========================
            // map to CourseDto
            // =========================
            var dto = new CourseDto
            {
                Id = course.ChildId,
                Slug = course.Slug,
                Title = course.ServiceTitle,
                Description = course.CourseDesc,
                Place = course.CoursePlace,
                Date = course.CourseDate,
                Days = course.CourseDays,
                Content = course.CourseContent,
                Cost = course.PlanCost,
                Files = courseFiles
            };

            return Ok(dto);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestCourses()
        {
            var courses = await _categoryService.GetLatestCoursesAsync(20);
            return Ok(courses);
        }

        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCourses()
        {
            // 1️⃣ جايب الـ User الحالي من Clerk
            var clerkUserId = _clerkService.GetAuthenticatedUserId(User);
            if (clerkUserId == null)
                return Unauthorized();

            var appUser = await _userRepo.GetByClerkIdAsync(clerkUserId);
            if (appUser == null)
                return NotFound("User not found in local DB");

            // 2️⃣ جيب كل الـ Enrollments بتاعت اليوزر ده (مدفوعة + مجانية)
            // بنستخدم AnyAsync + GetAllAsync بدل Specification عشان نضمن إن الـ Include شغال صح
            var allEnrollments = await _enrollmentRepo.GetAllAsync();
            var userEnrollments = allEnrollments
                .Where(e => e.UserId == appUser.Id)
                .ToList();

            var allPlanworks = (await _planRepo.GetAllAsync()).ToList();

            // 3️⃣ بنعمل Join يدوي بين Enrollment و Planwork
            var courses = userEnrollments
                .Select(e =>
                {
                    var plan = allPlanworks.FirstOrDefault(p => p.ChildId == e.PlanworkId);
                    if (plan == null) return null;
                    return new
                    {
                        ChildId = plan.ChildId,
                        CoursePlace = plan.CoursePlace,
                        CourseDate = plan.CourseDate,
                        ServiceTitle = plan.ServiceTitle,
                        Slug = plan.Slug,
                        EnrolledAt = e.EnrolledAt,
                        OrderId = e.OrderId,
                        Cost = plan.PlanCost,
                        IsFree = e.OrderId == null // ✅ المجاني مالوش Order
                    };
                })
                .Where(c => c != null)
                .ToList();

            return Ok(courses);
        }

        // ─── تسجيل في كورس مجاني مباشرة بدون Cart/Payment ───────────────
        [HttpPost("enroll-free/{planworkId}")]
        [Authorize]
        public async Task<IActionResult> EnrollInFreeCourse(int planworkId)
        {
            // 1️⃣ جيب الـ User الحالي
            var clerkUserId = _clerkService.GetAuthenticatedUserId(User);
            if (clerkUserId == null)
                return Unauthorized();

            var appUser = await _userRepo.GetByClerkIdAsync(clerkUserId);
            if (appUser == null)
                return NotFound("المستخدم غير موجود.");

            // 2️⃣ تحقق إن الكورس موجود ومجاني فعلاً
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var course = planworks.FirstOrDefault(p =>
                p.ChildId == planworkId &&
                p.CourseDate != null &&
                p.DetailsFlag == false &&
                (p.PlanCost == null || p.PlanCost == 0));

            if (course == null)
                return BadRequest(new { message = "الكورس غير موجود أو غير مجاني." });

            // 3️⃣ منع التكرار
            var alreadyEnrolled = await _enrollmentRepo.AnyAsync(
                e => e.UserId == appUser.Id && e.PlanworkId == planworkId);

            if (alreadyEnrolled)
                return Ok(new { message = "أنت مسجل في هذا الكورس بالفعل.", alreadyEnrolled = true });

            // 4️⃣ أنشئ Order وهمي بـ 0 جنيه عشان OrderId مش nullable في الداتابيز
            var freeOrder = new Order
            {
                UserId = appUser.Id,
                TotalAmount = 0,
                Status = OrderStatus.Paid,
                OrderNumber = Guid.NewGuid().ToString("N")
            };
            await _orderRepo.AddAsync(freeOrder);
            await _orderRepo.SaveChangesAsync();

            // 5️⃣ أنشئ الـ Enrollment مع الـ OrderId
            await _enrollmentRepo.AddAsync(new Enrollment
            {
                UserId = appUser.Id,
                PlanworkId = planworkId,
                OrderId = freeOrder.Id,
                EnrolledAt = DateTime.UtcNow
            });
            await _enrollmentRepo.SaveChangesAsync();

            return Ok(new
            {
                message = "تم تسجيلك في الكورس المجاني بنجاح.",
                alreadyEnrolled = false,
                courseTitle = course.ServiceTitle,
                courseSlug = course.Slug
            });
        }

    }
}