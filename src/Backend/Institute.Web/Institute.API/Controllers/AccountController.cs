using Institute.API.Helpers;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IClerkService _clerk;

        public AccountController(AppDbContext context, IClerkService clerk)
        {
            _context = context;
            _clerk = clerk;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> Sync()
        {
            var authHeader = Request.Headers["Authorization"].ToString();

            var clerkUserId = ClerkTokenReader.GetClerkUserId(authHeader);
            if (clerkUserId == null)
                return Unauthorized("Invalid token");

            var clerkUser = await _clerk.GetUserAsync(clerkUserId);
            if (clerkUser == null)
                return Unauthorized("User not found in Clerk");

            var user = await _context.AppUsers
                .IgnoreQueryFilters() // include deleted users
                .FirstOrDefaultAsync(x => x.ClerkUserId == clerkUserId);

            if (user != null && user.IsDeleted)
            {
                return BadRequest("This account has been deleted.");
            }

            if (user == null)
            {
                user = new AppUser
                {
                    ClerkUserId = clerkUserId,
                    Email = clerkUser.Email,
                    FirstName = clerkUser.FirstName,
                    LastName = clerkUser.LastName,
                    Username = clerkUser.Username ?? clerkUser.Email.Split('@')[0],
                    CreatedAt = DateTime.UtcNow
                };

                _context.AppUsers.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }
    }
}
