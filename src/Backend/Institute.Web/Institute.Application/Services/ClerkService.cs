using Institute.Application.DTOs;
using Institute.Application.Interfaces.IService;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Institute.Application.Services
{
    public class ClerkService : IClerkService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;

        public ClerkService(HttpClient client, IConfiguration config)
        {
            _client = client;
            _config = config;

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _config["Clerk:SecretKey"]);
        }

        public async Task<ClerkUserDto?> GetUserAsync(string clerkUserId)
        {
            var res = await _client.GetAsync($"https://api.clerk.com/v1/users/{clerkUserId}");

            if (!res.IsSuccessStatusCode)
                return null;

            var json = await res.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            return new ClerkUserDto
            {
                ClerkUserId = clerkUserId,
                Email = root.GetProperty("email_addresses")[0]
                            .GetProperty("email_address").GetString()!,
                FirstName = root.GetProperty("first_name").GetString(),
                LastName = root.GetProperty("last_name").GetString(),
                Username = root.GetProperty("username").GetString()
            };
        }
    }
}
