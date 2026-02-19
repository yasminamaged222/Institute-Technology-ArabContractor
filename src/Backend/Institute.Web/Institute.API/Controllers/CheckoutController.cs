//using Institute.API.DTOs.PaymentDtos;
//using Institute.Application.Interfaces;
//using Institute.Application.Interfaces.IService;
//using Institute.Application.Services;
//using Institute.Domain.Entities;
//using Institute.Domain.specifications;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace Institute.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class CheckoutController : ControllerBase
//    {
//        private readonly ICheckoutService _checkoutService;
//        private readonly BankPaymentService _bankPaymentService;
//        private readonly ICurrentUserService _currentUser;
//        private readonly IRepository<AppUser> _userReposiory;

//        public CheckoutController(ICheckoutService checkoutService, BankPaymentService bankPaymentService, ICurrentUserService currentUser)
//        {
//            _checkoutService = checkoutService;
//            _bankPaymentService = bankPaymentService;
//            _currentUser = currentUser;
//        }

//        [HttpPost("checkout")]
//        public async Task<IActionResult> Checkout()
//        {
//            // 1️⃣ جلب الـ ClerkUserId من الـ JWT
//            var clerkUserId = _currentUser.UserId;
//            if (clerkUserId == null) return Unauthorized();

//            // 2️⃣ جلب AppUser من DB
//            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
//            if (user == null) return BadRequest("User not found");

//            // 3️⃣ إنشاء Order تلقائي على أساس الـ Cart بتاعه
//            var order = await _checkoutService.CreateOrderAsync(user.Id);

//            // 4️⃣ Initiate checkout عند البنك و get full DTO
//            var checkoutResponse = await _bankPaymentService.InitiateCheckoutAsync(order);

//            // 5️⃣ Return JSON كامل للـ frontend
//            return Ok(checkoutResponse);
//        }



//        [HttpGet("result")]
//        public async Task<IActionResult> PaymentResult(int orderId, string transactionRef)
//        {
//            // 1. نتحقق من الدفع
//            var success = await _bankPaymentService.VerifyPaymentAsync(orderId.ToString());

//            // 2. نعمل تحديث للـ payment و enrollments
//            var payment = await _checkoutService.ProcessPaymentAsync(orderId, transactionRef, "ResponseFromBank", success);

//            return Ok(new PaymentResponseDto
//            {
//                OrderId = orderId,
//                TransactionRef = transactionRef,
//                IsSuccess = success,
//                GatewayResponse = payment.GatewayResponse
//            });
//        }
//        [AllowAnonymous]
//        [HttpPost("webhook")]
//        public async Task<IActionResult> PaymentWebhook()
//        {
//            using var reader = new StreamReader(Request.Body);
//            var body = await reader.ReadToEndAsync();

//            // ممكن تسجل الـ body لو عايز
//            // _logger.LogInformation(body);

//            // هنا هتستخرج orderId من البيانات اللي البنك باعتها
//            // حسب ال payload اللي بيجيلك

//            return Ok();
//        }

//    }
//}

using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints require authentication by default
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        private readonly BankPaymentService _bankPaymentService;
        private readonly ICurrentUserService _currentUser;

        public CheckoutController(
            ICheckoutService checkoutService,
            BankPaymentService bankPaymentService,
            ICurrentUserService currentUser)
        {
            _checkoutService = checkoutService;
            _bankPaymentService = bankPaymentService;
            _currentUser = currentUser;
        }

        /// <summary>
        /// POST /api/checkout/checkout
        /// Called by the React frontend when user clicks "المتابعة إلى الدفع".
        /// 1. Gets the user from Clerk JWT
        /// 2. Creates an Order from their Cart
        /// 3. Initiates a Mastercard Hosted Checkout session via BankPaymentService
        /// 4. Returns sessionId + successIndicator + checkoutJsUrl to frontend
        /// </summary>
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            // 1️⃣ Get ClerkUserId from the JWT token
            var clerkUserId = _currentUser.UserId;
            if (string.IsNullOrEmpty(clerkUserId))
                return Unauthorized(new { success = false, message = "غير مصرح. يرجى تسجيل الدخول." });

            // 2️⃣ Find the AppUser in the database
            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
            if (user == null)
                return BadRequest(new { success = false, message = "المستخدم غير موجود في قاعدة البيانات." });

            // 3️⃣ Create Order from the user's active Cart
            Order order;
            try
            {
                order = await _checkoutService.CreateOrderAsync(user.Id);
            }
            catch (Exception ex)
            {
                // e.g. "Cart is empty"
                return BadRequest(new { success = false, message = ex.Message });
            }

            // 4️⃣ Initiate Mastercard Hosted Checkout session
            var checkoutResponse = await _bankPaymentService.InitiateCheckoutAsync(order);

            if (!checkoutResponse.Success)
            {
                return StatusCode(502, new
                {
                    success = false,
                    message = checkoutResponse.Message ?? "فشل الاتصال ببوابة الدفع."
                });
            }

            // 5️⃣ Return the session data to the React frontend
            // Frontend uses sessionId + checkoutJsUrl to call window.Checkout.showPaymentPage()
            return Ok(new
            {
                success = true,
                message = "تم إنشاء جلسة الدفع بنجاح",
                data = new
                {
                    sessionId = checkoutResponse.Data.SessionId,
                    successIndicator = checkoutResponse.Data.SuccessIndicator,
                    orderId = checkoutResponse.Data.OrderId,
                    checkoutJsUrl = checkoutResponse.Data.CheckoutJsUrl
                }
            });
        }

        /// <summary>
        /// GET /api/checkout/result?orderId=...&transactionRef=...
        /// Called in two scenarios:
        ///   A) By the React completeCallback (via fetch) after Mastercard JS confirms success
        ///   B) After bank redirect (when user is sent back to ReturnUrl)
        ///
        /// Verifies payment with the bank, updates Order/Enrollment, returns result.
        /// </summary>
        [HttpGet("result")]
        public async Task<IActionResult> PaymentResult(
            [FromQuery] int orderId,
            [FromQuery] string transactionRef)
        {
            if (orderId <= 0)
                return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

            if (string.IsNullOrEmpty(transactionRef))
                return BadRequest(new { success = false, message = "مرجع المعاملة مفقود." });

            // 1️⃣ Verify payment status directly with the bank gateway
            var success = await _bankPaymentService.VerifyPaymentAsync(orderId.ToString());

            // 2️⃣ Update Order status, Payment record, and create Enrollments
            Payment payment;
            try
            {
                payment = await _checkoutService.ProcessPaymentAsync(
                    orderId,
                    transactionRef,
                    "VerifiedByGateway",
                    success);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = $"خطأ أثناء معالجة الدفع: {ex.Message}"
                });
            }

            // 3️⃣ Return result to the React frontend
            return Ok(new PaymentResponseDto
            {
                OrderId = orderId,
                TransactionRef = transactionRef,
                IsSuccess = success,
                GatewayResponse = payment?.GatewayResponse
            });
        }

        /// <summary>
        /// POST /api/checkout/webhook
        /// Optional: Receives async payment notifications from the bank.
        /// Useful for cases where the user closes the browser before completeCallback fires.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("webhook")]
        public async Task<IActionResult> PaymentWebhook()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            // TODO: Parse the bank's webhook payload format and call ProcessPaymentAsync
            // The exact payload structure depends on the Mastercard gateway configuration.
            // Example fields to extract: orderId, transactionRef, status

            // For now, just acknowledge receipt
            return Ok(new { received = true });
        }
    }
}