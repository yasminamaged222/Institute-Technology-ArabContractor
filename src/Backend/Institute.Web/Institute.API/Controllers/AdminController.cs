using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

      

        // GET: api/admin/users?keyword=ahmed
        [HttpGet("users")]
        public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> GetUsers(
                 [FromQuery] UserSpecParams param)

        {
            return Ok(await _adminService.GetAllUsersAsync(param));
        }


        [HttpGet("planworks")]
        public async Task<ActionResult<IReadOnlyList<PlanworkWithUsersDto>>> GetPlanworks(
     [FromQuery] PlanworkSpecParams param)
        {
            return Ok(await _adminService.GetAllPlanworksAsync(param));
        }
        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsDto>> GetStatistics()
        {
            var stats = await _adminService.GetStatsAsync();
            return Ok(stats);
        }

    }
}
