using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.NewsSpec;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class  NewsController : ControllerBase
    {
        private readonly IReadOnlyService<Dailynews> _newsService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;
        private readonly INewsService _newsWriteService;

        public NewsController(
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

         
    }
}
