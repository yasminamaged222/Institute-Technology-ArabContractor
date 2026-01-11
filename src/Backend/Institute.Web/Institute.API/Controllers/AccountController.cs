using Institute.Application.DTOs;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("sync")]
        public async Task<IActionResult> SyncUser()
        {
            var clerkUserId = User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(clerkUserId))
                return Unauthorized();

            var user = await _context.AppUsers
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ClerkUserId == clerkUserId);

            if (user == null)
            {
                user = new AppUser
                {
                    ClerkUserId = clerkUserId,
                    Username =
                        User.FindFirstValue("email") ??
                        User.FindFirstValue("name") ??
                        "user"
                };

                _context.AppUsers.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                ClerkUserId = user.ClerkUserId,
                Username = user.Username
            });
        }


    }
}
