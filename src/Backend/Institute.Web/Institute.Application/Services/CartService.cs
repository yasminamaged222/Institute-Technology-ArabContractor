using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class CartService : ICartService
    {
        private readonly IRepository<AppUser> _userRepository;
        private readonly IRepository<Cart> _cartRepository;
        private readonly IRepository<CartItem> _cartItemRepository;
        private readonly IRepository<Planwork> _planworkRepository;

        public CartService(
            IRepository<AppUser> userRepository,
            IRepository<Cart> cartRepository,
            IRepository<CartItem> cartItemRepository,
            IRepository<Planwork> planworkRepository)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _cartItemRepository = cartItemRepository;
            _planworkRepository = planworkRepository;
        }

        public async Task<Cart> GetUserCartAsync(string clerkUserId)
        {
            // 1️⃣ نجيب المستخدم
            var userSpec = new BaseSpecification<AppUser>(u => u.ClerkUserId == clerkUserId && !u.IsDeleted);
            var user = (await _userRepository.GetAllWithSpecAsync(userSpec)).FirstOrDefault();

            if (user == null)
                throw new Exception("User not found");

            // 2️⃣ نجيب الكارت
            var cartSpec = new BaseSpecification<Cart>(c => c.UserId == user.Id && !c.IsCheckedOut);
            cartSpec.AddInclude(c => c.Items);
            cartSpec.AddInclude("Items.Planwork");
            cartSpec.AddInclude("Items.Planwork.Files");

            var cart = (await _cartRepository.GetAllWithSpecAsync(cartSpec)).FirstOrDefault();

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow
                };

                await _cartRepository.AddAsync(cart);
                await _cartRepository.SaveChangesAsync();
            }

            return cart;
        }

        public async Task AddToCartAsync(string clerkUserId, int planworkId)
        {
            var cart = await GetUserCartAsync(clerkUserId);

            // نتأكد إنه مش موجود
            var itemSpec = new BaseSpecification<CartItem>(
                i => i.CartId == cart.Id && i.PlanworkId == planworkId);

            var existingItem = (await _cartItemRepository.GetAllWithSpecAsync(itemSpec))
                .FirstOrDefault();

            if (existingItem != null)
                return;

            // نجيب الكورس
            var planwork = await _planworkRepository.GetByIdAsync(planworkId);
            if (planwork == null)
                throw new Exception("Course not found");
            var cost = planwork.PlanCost ?? 0; // إذا كان null، نعتبره 0

            var cartItem = new CartItem
            {
                CartId = cart.Id,
                PlanworkId = planworkId,
                Price = cost
            };

            await _cartItemRepository.AddAsync(cartItem);
            await _cartItemRepository.SaveChangesAsync();


        }

        public async Task RemoveFromCartAsync(string clerkUserId, int planworkId)
        {
            var cart = await GetUserCartAsync(clerkUserId);

            var itemSpec = new BaseSpecification<CartItem>(
                i => i.CartId == cart.Id && i.PlanworkId == planworkId);

            var item = (await _cartItemRepository.GetAllWithSpecAsync(itemSpec))
                .FirstOrDefault();

            if (item == null)
                return;

            _cartItemRepository.Delete(item);
            await _cartItemRepository.SaveChangesAsync();

        }
    }
}