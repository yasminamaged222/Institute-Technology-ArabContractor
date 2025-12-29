using Institute.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        // In your controller
       
            private readonly IReadOnlyService<Book> _bookService;

            public BookController(IReadOnlyService<Book> bookService)
            {
                _bookService = bookService;
            }

            [HttpGet]
            public async Task<IActionResult> GetAllBooks()
            {
                var books = await _bookService.GetAll();
                return Ok(books);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> GetBook(int id)
            {
                var book = await _bookService.GetById(id);
                if (book == null) return NotFound();
                return Ok(book);
            }
        

    }
}
