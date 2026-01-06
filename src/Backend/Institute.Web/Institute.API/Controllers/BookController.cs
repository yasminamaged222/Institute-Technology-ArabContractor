using AutoMapper;
using Institute.API.DTOs;
using Institute.Domain.Entities;
using Institute.Domain.specifications.BookSpec;
using Institute.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        // In your controller
       
            private readonly IReadOnlyService<Book> _bookService;
        private readonly IMapper _mapper;

        public BookController(IReadOnlyService<Book> bookService, IMapper mapper)
            {
                _bookService = bookService;
            
            _mapper = mapper;
        }



        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Book>>> GetAll()
        //    {
        //        var spec = new Book_LoadNafigationProperty();
        //        var books = await _bookService.GetAll();
        //       // var books = await BaseRepository.GetAllWithSpecAsync(spec);
        //    return Ok(books);
        //}

        [HttpGet("getAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var spec = new Book_LoadNafigationProperty();
            // جلب البيانات من قاعدة البيانات
            var books = await _bookService.GetAllWithSpec(spec);

            // تحويل الـ Entity للـ DTO
            var booksDto = _mapper.Map<List<BookResponseDto>>(books);

            return Ok(booksDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var spec = new Book_LoadNafigationProperty();

            var book = await _bookService.GetEntityWithSpec(spec);

            var bookDto = _mapper.Map<BookResponseDto>(book);
            return Ok(bookDto);
        }


        }
}
