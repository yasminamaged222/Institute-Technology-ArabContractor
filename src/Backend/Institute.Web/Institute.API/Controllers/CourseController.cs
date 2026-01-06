using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCourses()
        {
            var courses = new[]
            {
                new { CourseId = 1, Name = "Mathematics", Description = "An introduction to mathematical concepts." },
                new { CourseId = 2, Name = "Physics", Description = "Fundamentals of physics and its applications." },
                new { CourseId = 3, Name = "Chemistry", Description = "Basics of chemical reactions and compounds." }
            };
            return Ok(courses);
        }

    }
}
