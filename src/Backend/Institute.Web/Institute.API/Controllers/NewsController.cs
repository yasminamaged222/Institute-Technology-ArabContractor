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

        private readonly IReadOnlyService<Dailynews> _bookService;
        private readonly IMapper _mapper;
        private readonly IRepository<Dailynews> _repo;

        public NewsController(IReadOnlyService<Dailynews> bookService, IMapper mapper,IRepository<Dailynews>  Repo )
        {
            _bookService = bookService;

            _mapper = mapper;
            _repo = Repo;
        }





        //[HttpGet("getAllNews")]
        //public async Task<IActionResult> GetAllNews()
        //{
        //    var spec = new NewsWithMainPicSpec();

        //    var news = await _bookService.GetAllWithSpec(spec);

        //    var result = _mapper.Map<IReadOnlyList<NewsListDto>>(news);

        //    return Ok(result);
        //}

        [HttpGet("getAllNews")]
        public async Task<ActionResult<Pagination<NewsListDto>>> GetAllNews([FromQuery] NewsSpecParams newsParams)
        {
            // 1️⃣ Spec للبيانات
            var spec = new NewsWithMainPicSpec(newsParams);

            // 2️⃣ جلب البيانات من الـ Repository
            var news = await _repo.GetAllWithSpecAsync(spec);

            // 3️⃣ Mapping
            var data = _mapper.Map<IReadOnlyList<Dailynews>, IReadOnlyList<NewsListDto>>(news);

            // 4️⃣ Spec للـ Count
            var countSpec = new NewsWithFiltersForCountSpec(newsParams);
            var count = await _repo.GetCountAsync(countSpec);

            // 5️⃣ Return Pagination
            return Ok(new Pagination<NewsListDto>(newsParams.PageIndex, newsParams.PageSize, count, data));
        }




        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid news id");

            var spec = new NewsWithMainPicSpec(id);

            var news = await _bookService.GetEntityWithSpec(spec);

            if (news == null)
                return NotFound();

            var newsDto = _mapper.Map<NewsListDto>(news);

            return Ok(newsDto);
        }




    }
}
