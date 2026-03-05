using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
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
            [FromQuery] string? keyword,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            return Ok(await _adminService.GetAllUsersAsync(keyword, fromDate, toDate));
        }


        [HttpGet("planworks")]
        public async Task<ActionResult<IReadOnlyList<PlanworkWithUsersDto>>> GetPlanworks(
            [FromQuery] string? keyword,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            return Ok(await _adminService.GetAllPlanworksAsync(keyword, fromDate, toDate));

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
