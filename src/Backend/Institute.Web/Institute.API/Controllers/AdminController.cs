using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            [FromQuery] string? keyword)
        {
            if (!string.IsNullOrWhiteSpace(keyword))
                return Ok(await _adminService.SearchUsersAsync(keyword));

            return Ok(await _adminService.GetAllUsersAsync());
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
