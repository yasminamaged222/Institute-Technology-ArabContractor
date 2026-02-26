using AutoMapper;
﻿using Institute.API.DTOs;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IMapper _mapper;

        public CartController(ICartService cartService, ICurrentUserService currentUser, IMapper mapper)
        {
            _cartService = cartService;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetUserCartAsync(_currentUser.UserId);
            var result = _mapper.Map<CartDto>(cart);

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
