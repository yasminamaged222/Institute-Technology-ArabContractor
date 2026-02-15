using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        private readonly BankPaymentService _bankPaymentService;
        private readonly ICurrentUserService _currentUser;
        private readonly IRepository<AppUser> _userReposiory;

        public CheckoutController(ICheckoutService checkoutService, BankPaymentService bankPaymentService, ICurrentUserService currentUser)
        {
            _checkoutService = checkoutService;
            _bankPaymentService = bankPaymentService;
            _currentUser = currentUser;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            // 1️⃣ جلب الـ ClerkUserId من الـ JWT
            var clerkUserId = _currentUser.UserId;
            if (clerkUserId == null) return Unauthorized();

            // 2️⃣ جلب AppUser من DB
            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
            if (user == null) return BadRequest("User not found");

            // 3️⃣ إنشاء Order تلقائي على أساس الـ Cart بتاعه
            var order = await _checkoutService.CreateOrderAsync(user.Id);

            return Ok(order);
        }


        [HttpGet("result")]
        public async Task<IActionResult> PaymentResult(int orderId, string transactionRef)
        {
            // 1. نتحقق من الدفع
            var success = await _bankPaymentService.VerifyPaymentAsync(orderId.ToString());

            // 2. نعمل تحديث للـ payment و enrollments
            var payment = await _checkoutService.ProcessPaymentAsync(orderId, transactionRef, "ResponseFromBank", success);

            return Ok(new PaymentResponseDto
            {
                OrderId = orderId,
                TransactionRef = transactionRef,
                IsSuccess = success,
                GatewayResponse = payment.GatewayResponse
            });
        }
    }
}
