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
                .FirstOrDefaultAsync(x => x.ClerkUserId == clerkUserId);

            if (user == null)
            {
                user = new AppUser
                {
                    ClerkUserId = clerkUserId,
                    Email = User.FindFirstValue("email"),
                    FirstName = User.FindFirstValue("given_name"),
                    LastName = User.FindFirstValue("family_name"),
                    Username = User.FindFirstValue("email") ?? "user",
                    CreatedAt = DateTime.UtcNow
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
