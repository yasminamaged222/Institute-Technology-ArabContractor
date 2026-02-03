using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
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

        public CourseController(
            IRepository<Planwork> planRepo,
            IRepository<PlanFile> fileRepo)
        {
            _planRepo = planRepo;
            _fileRepo = fileRepo;
        }

        
        [HttpGet("programs/{programId}/courses")]
        public async Task<IActionResult> GetProgramCourses(int programId)
        {
            // ✅ هات كل الداتا مرة واحدة
            var planworks = (await _planRepo.GetAllAsync()).ToList();
            var files = (await _fileRepo.GetAllAsync()).ToList();

            // ✅ تأكد إن الـ Program / Axis موجود
            var program = planworks.FirstOrDefault(x => x.ChildId == programId);
            if (program == null)
                return NotFound($"Program or Axis with id {programId} not found");

            // ✅ جمع الكورسات Recursive (نفس Logic الـ Builder)
            var courses = GetCoursesRecursive(planworks, files, programId);

            // ✅ Response النهائي (Cards)
            return Ok(new ProgramCoursesDto
            {
                ProgramId = program.ChildId,
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


    }
}
