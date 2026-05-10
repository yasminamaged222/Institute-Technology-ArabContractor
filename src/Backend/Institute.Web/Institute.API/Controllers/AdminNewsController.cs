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
    [Route("api/admin/[controller]")]
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

        // ── GET ALL ─────────────────────────────
        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews(
    [FromQuery] NewsSpecParams newsParams)
        {
            var spec = new NewsWithMainPicSpec(newsParams);
            var news = await _repo.GetAllWithSpecAsync(spec);

            var data = news.Select(x => new NewsListDto
            {
                Id = x.NewsId,
                Title = x.ATitel,
                PublishedAt = x.NewsDate ?? DateTime.UtcNow,

                ImageUrl = x.NewsPics?
    .OrderBy(p => p.PicPeriorty)
    .FirstOrDefault()?.ImageName != null
        ? $"https://acwebappbackup.blob.core.windows.net/icemt/{x.NewsPics
            .OrderBy(p => p.PicPeriorty)
            .FirstOrDefault().ImageName}"
        : null
            }).ToList();

            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            return Ok(new Pagination<NewsListDto>(
                newsParams.PageIndex,
                newsParams.PageSize,
                count,
                data));
        }

        // ── GET BY ID ───────────────────────────
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid news id");

            var spec = new NewsWithDetailsSpec(id);
            var news = await _newsService.GetEntityWithSpec(spec);

            if (news == null)
                return NotFound();

            return Ok(new NewsDetailsDto
            {
                Id = news.NewsId,
                Title = news.ATitel,
                Details = news.ADetails,
                PublishedAt = news.NewsDate ?? DateTime.UtcNow,
                ImageUrl = news.NewsPics?
    .OrderBy(p => p.PicPeriorty)
    .FirstOrDefault()?.ImageName != null
        ? $"https://acwebappbackup.blob.core.windows.net/icemt/{news.NewsPics
            .OrderBy(p => p.PicPeriorty)
            .FirstOrDefault().ImageName}"
        : null
            });
        }

        // ── CREATE ───────────────────────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] NewsCreateUpdateDto dto)
        {
            var result = await _newsWriteService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetNewsById),
                new { id = result.Id },
                result);
        }

        // ── UPDATE ───────────────────────────────
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] NewsCreateUpdateDto dto)
        {
            var result = await _newsWriteService.UpdateAsync(id, dto);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // ── DELETE ───────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _newsWriteService.DeleteAsync(id);

            if (!result)
                return NotFound();

            return Ok(new { message = "Deleted successfully" });
        }
    }
}