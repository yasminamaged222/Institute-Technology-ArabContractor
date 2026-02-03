using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/categories/tree
        [HttpGet("tree")]
        public async Task<IActionResult> GetTree()
        {
            var tree = await _categoryService.GetCategoryTreeAsync();
            return Ok(tree);
        }
    }
}
