using Institute.Infrastructure;
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
            try
            {
                // =========================
                // READ BODY
                // =========================
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();

                _logger.LogInformation("Webhook body: " + body);

                // =========================
                // 🔒 VERIFY SIGNATURE
                // =========================
                var secret = _config["Clerk:WebhookSecret"];
                var webhook = new Webhook(secret);

                var headers = new System.Net.WebHeaderCollection();
                foreach (var h in Request.Headers)
                {
                    headers.Add(h.Key, h.Value.FirstOrDefault() ?? "");
                }

                webhook.Verify(body, headers); // لو فشل، هيرمي Exception عادي
                _logger.LogInformation("Webhook signature verified");

                // =========================
                // PARSE JSON
                // =========================
                using var doc = JsonDocument.Parse(body);
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
            catch (Exception ex) // catch عام عشان يشمل كل الاستثناءات
            {
                _logger.LogError(ex, "Webhook failed or signature invalid");
                return Unauthorized();
            }
        }
    }
}
