using Institute.Application.DTOs;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/[controller]")]
public class AdminLecturerController : ControllerBase
{
    private readonly ILecturerService _service;
    private readonly IWebHostEnvironment _env;

    public AdminLecturerController(ILecturerService service, IWebHostEnvironment env)
    {
        _service = service;
        _env = env;
    }

    // ── GET ALL ───────────────────────────────────────────────────────────────
    /// <summary>GET /api/admin/adminlecturer — يجيب كل المحاضرين</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/admin/adminlecturer/{id}</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────
    /// <summary>
    /// POST /api/admin/adminlecturer
    /// Body: { name, specialty, email, phone, courses, level, details }
    /// </summary>
    [HttpPost]
    // [HasPermission("Lecturers")]
    public async Task<IActionResult> Create([FromBody] LecturerCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/admin/adminlecturer/{id}
    /// Body: { name, specialty, email, phone, courses, level, details }
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] LecturerCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new { message = "المحاضر غير موجود." });

        return Ok(updated);
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    /// <summary>DELETE /api/admin/adminlecturer/{id}</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result)
            return NotFound(new { message = "المحاضر غير موجود." });

        return Ok(new { message = "تم حذف المحاضر بنجاح." });
    }

    // ── UPLOAD PHOTO ──────────────────────────────────────────────────────────
    /// <summary>
    /// POST /api/admin/adminlecturer/{id}/photo
    /// Form: file (IFormFile)
    /// </summary>
    [HttpPost("{id}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "الملف مطلوب." });

        // Local development → wwwroot/images/lecturers
        // Production (Azure) → D:\home\site\userfiles\icemt\assets\images
        var uploadsFolder = _env.IsDevelopment()
            ? Path.Combine(_env.WebRootPath ?? _env.ContentRootPath, "images", "lecturers")
            : "D:\\home\\site\\userfiles\\icemt\\assets\\images";

        var imageUrl = await _service.UploadPhotoAsync(id, file, uploadsFolder);

        if (imageUrl == null)
            return NotFound(new { message = "المحاضر غير موجود." });

        return Ok(new { imageUrl });
    }
}