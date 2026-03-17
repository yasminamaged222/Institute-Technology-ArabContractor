using Institute.API.DTOs;
using Institute.API.DTOs.AdminDtos;
using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Course;
using Institute.Domain.specifications.AdminSpec.User;
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
        private readonly IWebHostEnvironment _env;


        public AdminController(IAdminService adminService, IWebHostEnvironment env)
        {
            _adminService = adminService;
            _env = env;

        }



        // GET: api/admin/users?keyword=ahmed
        [HttpGet("users")]
        public async Task<ActionResult<IReadOnlyList<UserWithCoursesDto>>> GetUsers(
                 [FromQuery] UserSpecParams param)

        {
            return Ok(await _adminService.GetAllUsersAsync(param));
        }


        [HttpGet("planworks")]
        public async Task<ActionResult<IReadOnlyList<PlanworkWithUsersDto>>> GetPlanworks(
     [FromQuery] PlanworkSpecParams param)
        {
            return Ok(await _adminService.GetAllPlanworksAsync(param));
        }
        // GET: api/admin/stats
        [HttpGet("stats")]
        public async Task<ActionResult<AdminStatsDto>> GetStatistics()
        {
            var stats = await _adminService.GetStatsAsync();
            return Ok(stats);
        }

        //[HttpPost("upload")]
        //public async Task<IActionResult> UploadCertificate([FromForm] UploadCertificateDto dto)
        //{
        //    if (dto.File == null || dto.File.Length == 0)
        //        return BadRequest("File is required");

        //    var exists = await _context.Certificates
        //        .AnyAsync(x => x.UserId == dto.UserId && x.PlanworkId == dto.PlanworkId);

        //    if (exists)
        //        return BadRequest("Certificate already uploaded");

        //    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/certificates");

        //    if (!Directory.Exists(uploadsFolder))
        //        Directory.CreateDirectory(uploadsFolder);

        //    var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);

        //    var filePath = Path.Combine(uploadsFolder, fileName);

        //    using (var stream = new FileStream(filePath, FileMode.Create))
        //    {
        //        await dto.File.CopyToAsync(stream);
        //    }

        //    var certificate = new Certificate
        //    {
        //        UserId = dto.UserId,
        //        PlanworkId = dto.PlanworkId,
        //        FileUrl = "/certificates/" + fileName,
        //        FileName = dto.File.FileName,
        //        FileSizeBytes = dto.File.Length,
        //        UploadedAt = DateTime.UtcNow
        //    };

        //    _context.Certificates.Add(certificate);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Certificate uploaded successfully" });
        //}

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCertificate([FromForm] UploadCertificateDto dto)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "certificates");

            var result = await _adminService.UploadCertificateAsync(dto, uploadsFolder);

            if (!result)
                return BadRequest("Certificate already uploaded");

            return Ok(new { message = "Certificate uploaded successfully" });
        }

        [HttpPatch("enrollments/{id}/attendance")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] bool attended)
        {
            var result = await _adminService.UpdateAttendanceAsync(id, attended);
            if (!result)
                return NotFound(new { message = "Enrollment not found" });

            return Ok(new { message = "Attendance updated successfully" });
        }

        [HttpGet("certificates")]
        public async Task<ActionResult<IReadOnlyList<CertificateDto>>> GetCertificates()
        {
            var result = await _adminService.GetAllCertificatesAsync();
            return Ok(result);
        }
    }
}
