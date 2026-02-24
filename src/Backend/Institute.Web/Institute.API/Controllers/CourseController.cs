using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.CourseSpec;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Planwork> _planRepo;
        private readonly IRepository<PlanFile> _fileRepo;
        private readonly ICategoryService _categoryService;

        public CourseController(
            IRepository<Planwork> planRepo,
            IRepository<PlanFile> fileRepo,
            ICategoryService categoryService)
        {
            _planRepo = planRepo;
            _fileRepo = fileRepo;
            _categoryService = categoryService;
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
    }
}
