 
using Institute.Application.DTOs;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LecturerController : ControllerBase
{
    private readonly ILecturerService _service;

    public LecturerController(ILecturerService service)
    {
        _service = service;
    }

    // ── GET ALL ───────────────────────────────────────────────────────────────
    /// <summary>GET /api/lecturer — يجيب كل المحاضرين (عام، بدون Auth)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────
    /// <summary>GET /api/lecturer/{id}</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    // ── CREATE ────────────────────────────────────────────────────────────────
    /// <summary>
    /// POST /api/lecturer
    /// Body: { name, specialty, email, phone, courses, level, details }
    /// يحتاج permission "Lecturers"
    /// </summary>
    [HttpPost]
  //  [HasPermission("Lecturers")]
    public async Task<IActionResult> Create([FromBody] LecturerCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    /// <summary>
    /// PUT /api/lecturer/{id}
    /// Body: { name, specialty, email, phone, courses, level, details }
    /// يحتاج permission "Lecturers"
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
    /// <summary>
    /// DELETE /api/lecturer/{id}
    /// يحتاج permission "Lecturers"
    /// </summary>
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
    /// POST /api/lecturer/{id}/photo
    /// Form: file (IFormFile)
    /// يحتاج permission "Lecturers"
    /// </summary>
    [HttpPost("{id}/photo")]
     
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "الملف مطلوب." });

        var uploadsFolder = "D:\\home\\site\\userfiles\\lecturers";
        var imageUrl = await _service.UploadPhotoAsync(id, file, uploadsFolder);

        if (imageUrl == null)
            return NotFound(new { message = "المحاضر غير موجود." });

        return Ok(new { imageUrl });
    }
}