// ══════════════════════════════════════════════════════════
// المسار: Institute.API/Controllers/NewsController.cs
// استبدل الملف الموجود بالكامل
// ══════════════════════════════════════════════════════════
using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Security;
using Institute.Domain.Entities;
using Institute.Domain.specifications.NewsSpec;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminNewsController : ControllerBase
    {
        private readonly IReadOnlyService<Dailynews> _newsService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;
        private readonly INewsService _newsWriteService;

        public AdminNewsController(
            IReadOnlyService<Dailynews> newsService,
            IMapper mapper,
            IRepository<Dailynews> repo,
            INewsService newsWriteService)
        {
            _newsService = newsService;
            _mapper = mapper;
            _repo = repo;
            _newsWriteService = newsWriteService;
        }

        // ── GET ALL (موجود) ───────────────────────────────────────────────────
        /// <summary>GET /api/news/getAllNews?pageIndex=1&amp;pageSize=10</summary>
        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews(
            [FromQuery] NewsSpecParams newsParams)
        {
            var spec = new NewsWithMainPicSpec(newsParams);
            var news = await _repo.GetAllWithSpecAsync(spec);
            var data = _mapper.Map<IReadOnlyList<Dailynews>, IReadOnlyList<NewsListDto>>(news);
            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            return Ok(new Pagination<NewsListDto>(
                newsParams.PageIndex, newsParams.PageSize, count, data));
        }

        // ── GET BY ID (موجود) ─────────────────────────────────────────────────
        /// <summary>GET /api/news/{id}</summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0) return BadRequest("Invalid news id");

            var spec = new NewsWithDetailsSpec(id);
            var news = await _newsService.GetEntityWithSpec(spec);
            if (news == null) return NotFound();

            return Ok(_mapper.Map<NewsDetailsDto>(news));
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        /// <summary>
        /// POST /api/news
        /// Form: title, details, date, image? (IFormFile)
        /// يحتاج permission "News"
        /// </summary>
        [HttpPost]
         public async Task<IActionResult> Create([FromForm] NewsCreateUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "عنوان الخبر مطلوب." });

            if (string.IsNullOrWhiteSpace(dto.Details))
                return BadRequest(new { message = "تفاصيل الخبر مطلوبة." });

            var uploadsFolder = "D:\\home\\site\\userfiles\\news";
            var result = await _newsWriteService.CreateAsync(dto, uploadsFolder);

            return CreatedAtAction(nameof(GetNewsById), new { id = result.Id }, result);
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        /// <summary>
        /// PUT /api/news/{id}
        /// Form: title, details, date, image? (IFormFile — اختياري، لو مش موجود تفتكر الصورة القديمة)
        /// يحتاج permission "News"
        /// </summary>
        [HttpPut("{id}")]
         public async Task<IActionResult> Update(int id, [FromForm] NewsCreateUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "عنوان الخبر مطلوب." });

            var uploadsFolder = "D:\\home\\site\\userfiles\\news";
            var result = await _newsWriteService.UpdateAsync(id, dto, uploadsFolder);

            if (result == null)
                return NotFound(new { message = "الخبر غير موجود." });

            return Ok(result);
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        /// <summary>
        /// DELETE /api/news/{id}
        /// يحتاج permission "News"
        /// </summary>
        [HttpDelete("{id}")]
         public async Task<IActionResult> Delete(int id)
        {
            var uploadsFolder = "D:\\home\\site\\userfiles\\news";
            var result = await _newsWriteService.DeleteAsync(id, uploadsFolder);

            if (!result)
                return NotFound(new { message = "الخبر غير موجود." });

            return Ok(new { message = "تم حذف الخبر بنجاح." });
        }
    }
}