using Institute.API.DTOs;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly ICurrentUserService _currentUser;

        public CartController(ICartService cartService, ICurrentUserService currentUser)
        {
            _cartService = cartService;
            _currentUser = currentUser;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetUserCartAsync(_currentUser.UserId);

            var result = new CartDto
            {
                Id = cart.Id,
                CreatedAt = cart.CreatedAt,
                Items = cart.Items.Select(i => new CartItemDto
                {
                    PlanworkId = i.PlanworkId,
                    Price = i.Price,
                    Title = i.Planwork?.ServiceTitle,
                    Place = i.Planwork?.CoursePlace,
                    Date = i.Planwork?.CourseDate,
                    Days = i.Planwork?.CourseDays,
                    Cost = i.Planwork?.PlanCost,
                    Slug = i.Planwork?.Slug,
                }).ToList()
            };

            return Ok(result);
        }

        [HttpPost("add/{planworkId}")]
        public async Task<IActionResult> AddToCart(int planworkId)
        {
            await _cartService.AddToCartAsync(_currentUser.UserId, planworkId);
            return Ok();
        }

        [HttpDelete("remove/{planworkId}")]
        public async Task<IActionResult> RemoveFromCart(int planworkId)
        {
            await _cartService.RemoveFromCartAsync(_currentUser.UserId, planworkId);
            return Ok();
        }
    }
}