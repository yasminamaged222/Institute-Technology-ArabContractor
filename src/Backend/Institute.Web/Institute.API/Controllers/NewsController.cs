using AutoMapper;
using Institute.API.DTOs;
using Institute.API.Helpers;
using Institute.Application.Interfaces;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Institute.Domain.specifications.BookSpec;
using Institute.Domain.specifications.NewsSpec;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        // In your controller

        private readonly IReadOnlyService<Dailynews> _newsService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;

        public NewsController(IReadOnlyService<Dailynews> newsService, IMapper mapper,IRepository<Dailynews>  Repo )
        {
            _newsService = newsService;

            _mapper = mapper;
            _repo = Repo;
        }


        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews(
     [FromQuery] NewsSpecParams newsParams)
        {
            // 1️⃣ Spec للبيانات
            var spec = new NewsWithMainPicSpec(newsParams);

            // 2️⃣ جلب البيانات
            var news = await _repo.GetAllWithSpecAsync(spec);

            // 3️⃣ Mapping
            var data = _mapper.Map<IReadOnlyList<Dailynews>, IReadOnlyList<NewsListDto>>(news);

            // 4️⃣ Count
            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            // 5️⃣ Pagination (final shape)
            return Ok(new Pagination<NewsListDto>(
                newsParams.PageIndex,
                newsParams.PageSize,
                count,
                data
            ));
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid news id");

            var spec = new NewsWithDetailsSpec(id);

            var news = await _newsService.GetEntityWithSpec(spec);

            if (news == null)
                return NotFound();

            var newsDto = _mapper.Map<NewsDetailsDto>(news);

            return Ok(newsDto);
        }




    }
}
