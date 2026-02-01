using Institute.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Svix;
using System.Text.Json;

namespace Institute.API.Controllers
{
    [ApiController]
    [Route("api/webhooks/clerk")]
    public class ClerkWebhookController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<ClerkWebhookController> _logger;

        public ClerkWebhookController(
            AppDbContext context,
            IConfiguration config,
            ILogger<ClerkWebhookController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Handle()
        {
            var body = await new StreamReader(Request.Body).ReadToEndAsync();

            try
            {
                // =========================
                // 🔒 VERIFY SIGNATURE
                // =========================
                var secret = _config["Clerk:WebhookSecret"];
                var webhook = new Webhook(secret);

                var headers = new System.Net.WebHeaderCollection();

                foreach (var h in Request.Headers)
                {
                    headers.Add(h.Key, h.Value);
                }
                webhook.Verify(body, headers);

                // =========================
                // PARSE JSON
                // =========================
                var doc = System.Text.Json.JsonDocument.Parse(body);

                var type = doc.RootElement.GetProperty("type").GetString();
                var data = doc.RootElement.GetProperty("data");

                var clerkUserId = data.GetProperty("id").GetString();

                _logger.LogInformation($"Webhook received: {type} for {clerkUserId}");

                // =========================
                // USER DELETED
                // =========================
                if (type == "user.deleted")
                {
                    var user = await _context.AppUsers
                        .IgnoreQueryFilters()
                        .FirstOrDefaultAsync(x => x.ClerkUserId == clerkUserId);

                    if (user != null)
                    {
                        user.IsDeleted = true;
                        await _context.SaveChangesAsync();

                        _logger.LogInformation($"User soft deleted: {clerkUserId}");
                    }
                }

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Webhook failed");
                return Unauthorized();
            }
        }
    }
}
