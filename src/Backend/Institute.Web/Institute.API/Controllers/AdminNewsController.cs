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
                ImageUrl = BuildImageUrl(
                        x.NewsPics?
                        .OrderBy(p => p.PicPeriorty)
                        .FirstOrDefault()?.ImageName
            )
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
                ImageUrl = BuildImageUrl(
                        news.NewsPics?
                        .OrderBy(p => p.PicPeriorty)
                        .FirstOrDefault()?.ImageName),

                // ✅ زيادة — كل الصور مرتبة
                ImageUrls = news.NewsPics?
                    .OrderBy(p => p.PicPeriorty)
                    .Select(p => BuildImageUrl(p.ImageName))
                    .ToList()
            });
        }

        // ── CREATE ───────────────────────────────
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] NewsCreateUpdateDto dto)
        {
            var result = await _newsWriteService.CreateAsync(dto);

            // ✅ زيادة — بناء الـ URL بعد ما الـ Service يرجع اسم الملف بس
            result.ImageUrl = BuildImageUrl(result.ImageUrl);
            result.ImageUrls = result.ImageUrls?.Select(u => BuildImageUrl(u)).ToList();

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

            // ✅ زيادة — بناء الـ URL بعد ما الـ Service يرجع اسم الملف بس
            result.ImageUrl = BuildImageUrl(result.ImageUrl);
            result.ImageUrls = result.ImageUrls?.Select(u => BuildImageUrl(u)).ToList();

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

        // ── BUILD URL (SAFE) ─────────────────────────
        private string? BuildImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            return $"https://acwebappbackup.blob.core.windows.net/icemt/news/{blobName}";
        }
    }
}