using Institute.Application.DTOs;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IConfiguration _config;

        public AccountController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("sync")]
        public async Task<IActionResult> SyncUser()
        {
            var clerkUserId =
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (clerkUserId == null)
                return Unauthorized();

            // Call Clerk API
            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _config["Clerk:SecretKey"]);

            var response = await client.GetAsync(
                $"https://api.clerk.com/v1/users/{clerkUserId}"
            );

            if (!response.IsSuccessStatusCode)
                return StatusCode(500, "Failed to fetch Clerk user");

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            var email = doc.RootElement
                .GetProperty("email_addresses")[0]
                .GetProperty("email_address")
                .GetString();

            var firstName = doc.RootElement.GetProperty("first_name").GetString();
            var lastName = doc.RootElement.GetProperty("last_name").GetString();
            var username = doc.RootElement.GetProperty("username").GetString();

            var user = await _context.AppUsers
                .FirstOrDefaultAsync(x => x.ClerkUserId == clerkUserId);

            if (user == null)
            {
                user = new AppUser
                {
                    ClerkUserId = clerkUserId,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    Username = username ?? email.Split('@')[0],
                    CreatedAt = DateTime.UtcNow
                };

                _context.AppUsers.Add(user);
                await _context.SaveChangesAsync();
            }

            return Ok(user);
        }

        //[HttpPost("login")]
        //[Authorize]
        //public async Task<IActionResult> Login()
        //{
        //    // 1️⃣ Clerk User ID from token
        //    var clerkUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        //                      ?? User.FindFirst("sub")?.Value;

        //    if (clerkUserId == null)
        //        return Unauthorized();

        //    // 2️⃣ Call Clerk API
        //    var client = new HttpClient();
        //    client.DefaultRequestHeaders.Authorization =
        //        new AuthenticationHeaderValue("Bearer", _config["Clerk:SecretKey"]);

        //    var response = await client.GetAsync(
        //        $"https://api.clerk.com/v1/users/{clerkUserId}"
        //    );

        //    if (!response.IsSuccessStatusCode)
        //        return StatusCode(500, "Failed to fetch Clerk user");

        //    var json = await response.Content.ReadAsStringAsync();
        //    var doc = JsonDocument.Parse(json);

        //    var email = doc.RootElement
        //        .GetProperty("email_addresses")[0]
        //        .GetProperty("email_address")
        //        .GetString();

        //    var firstName = doc.RootElement.GetProperty("first_name").GetString();
        //    var lastName = doc.RootElement.GetProperty("last_name").GetString();

        //    // 3️⃣ Print (like Node)
        //    Console.WriteLine("====== AUTH SYNC ======");
        //    Console.WriteLine($"Clerk User ID: {clerkUserId}");
        //    Console.WriteLine($"Email: {email}");
        //    Console.WriteLine($"First Name: {firstName}");
        //    Console.WriteLine($"Last Name: {lastName}");
        //    Console.WriteLine($"Username: {firstName +" "+ lastName}");
        //    Console.WriteLine("=======================");

        //    return Ok(new
        //    {
        //        success = true,
        //        clerkUserId
        //    });
        //}

        [Authorize]
        [HttpPost("test-auth")]
        public IActionResult TestAuth()
        {
            return Ok(new
            {
                IsAuth = User.Identity?.IsAuthenticated,
                Claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }
    }
}
