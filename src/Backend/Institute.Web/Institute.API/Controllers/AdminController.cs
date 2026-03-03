using Institute.API.DTOs.AdminDtos;
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

        // GET ALL USERS WITHOUT SEARCH



        // GET: api/users
        //[HttpGet("users")]
        //public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> GetAllUsers()
        //{
        //    var users = await _adminService.GetAllUsersAsync();
        //    return Ok(users);
        //}

        // GET: api/users/search?keyword=ahmed
        [HttpGet("users/search")]
        public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> SearchUsers(
            [FromQuery] string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required.");

            var users = await _adminService.SearchUsersAsync(keyword);

            return Ok(users);
        }




        // GET ALL USERS WITH SEARCH




        // GET: api/admin/users?keyword=ahmed
        [HttpGet("users")]
        public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> GetUsers(
            [FromQuery] string? keyword)
        {
            if (!string.IsNullOrWhiteSpace(keyword))
                return Ok(await _adminService.SearchUsersAsync(keyword));

            return Ok(await _adminService.GetAllUsersAsync());
        }
    }
}
