using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Institute.Domain.Enums;
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
            if (!checkoutResponse.Success || checkoutResponse.Data == null)
            {
                return StatusCode(502, new
                {
                    success = false,
                    message = checkoutResponse.Message ?? "فشل الاتصال ببوابة الدفع."
                });
            }
            order.GatewaySessionId = checkoutResponse.Data.SessionId;
            order.SuccessIndicator = checkoutResponse.Data.SuccessIndicator;

            await _checkoutService.UpdateOrderGatewayDataAsync(order);



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
        [AllowAnonymous]
        public async Task<IActionResult> PaymentResult(
    [FromQuery] int orderId,
    [FromQuery] string? transactionRef,
    [FromQuery] string? resultIndicator)
        {
            var refToUse = transactionRef ?? resultIndicator;

            if (orderId <= 0)
                return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

            if (string.IsNullOrEmpty(refToUse))
                return BadRequest(new { success = false, message = "مرجع المعاملة مفقود." });

            var order = await _checkoutService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound("الطلب غير موجود.");

            // ✅ المقارنة الصح: resultIndicator الجاي في URL == successIndicator المحفوظ عند إنشاء الجلسة
            bool success = refToUse == order.SuccessIndicator;

            if (!success)
            {
                order.Status = OrderStatus.Cancelled;
                await _checkoutService.UpdateOrderAsync(order);
                return BadRequest(new { success = false, message = "فشل الدفع أو بيانات غير صحيحة." });
            }

            // ✅ اختياري: verify مع البنك للتأكيد الإضافي
            var verify = await _bankPaymentService.VerifyPaymentAsync(order.OrderNumber);
            if (!verify.IsSuccess)
            {
                order.Status = OrderStatus.Cancelled;
                await _checkoutService.UpdateOrderAsync(order);
                return BadRequest(new { success = false, message = "البنك لم يؤكد الدفع." });
            }

            var payment = await _checkoutService.MarkOrderAsPaidAsync(order, refToUse, verify.GatewayResponse ?? "VerifiedByGateway");

            return Ok(new PaymentResponseDto
            {
                OrderId = orderId,
                TransactionRef = refToUse,
                IsSuccess = true,
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
        /// <summary>
        /// POST /api/checkout/refund
        /// Admin only — يعمل Refund كامل للـ Order ويلغي الـ Enrollments
        /// Body: { "orderId": 80, "adminNote": "سبب الاسترداد" }
        /// </summary>
        //[HttpPost("refund")]
        //[Authorize(Roles = "Admin")]
        //public async Task<IActionResult> RefundOrder([FromBody] RefundRequestDto request)
        //{
        //    if (request.OrderId <= 0)
        //        return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

        //    var result = await _checkoutService.RefundOrderAsync(
        //        request.OrderId,
        //        request.AdminNote ?? "استرداد من الادمن"
        //    );

        //    if (!result.IsSuccess)
        //        return BadRequest(new { success = false, message = result.Message });

        //    return Ok(new
        //    {
        //        success = true,
        //        message = result.Message,
        //        data = new
        //        {
        //            orderId = request.OrderId,
        //            refundAmount = result.Payment?.Amount,
        //            refundDate = result.Payment?.RefundDate,
        //            status = "Refunded"
        //        }
        //    });
        //}

        [HttpGet("order/{orderId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            if (orderId <= 0)
                return BadRequest(new { success = false, message = "رقم الطلب غير صحيح." });

            var order = await _checkoutService.GetOrderByIdAsync(orderId);
            if (order == null)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            // Only return details for paid orders (security: don't expose pending/cancelled)
            if (order.Status != Domain.Enums.OrderStatus.Paid)
                return BadRequest(new { success = false, message = "لم يتم تأكيد الدفع بعد." });

            return Ok(new
            {
                success = true,
                data = new
                {
                    orderId = order.Id,
                    orderNumber = order.OrderNumber,
                    totalAmount = order.TotalAmount,
                    currency = "EGP",
                    status = order.Status.ToString(),
                    createdAt = order.CreatedAt,
                    items = order.Items.Select(i => new
                    {
                        planworkId = i.PlanworkId,
                        price = i.Price
                    })
                }
            });
        }
    }

    public class RefundRequestDto
    {
        public int OrderId { get; set; }
        public string? AdminNote { get; set; }
    }
}