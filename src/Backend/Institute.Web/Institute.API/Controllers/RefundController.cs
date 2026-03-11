using Institute.API.DTOs.PaymentDtos;
using Institute.Application.Interfaces.IService;
using Institute.Application.Services;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;
        private readonly ICurrentUserService _currentUser;
        private readonly ICheckoutService _checkoutService;
        private readonly BankPaymentService _bankPaymentService;

        public RefundController(
            IRefundService refundService,
            ICurrentUserService currentUser,
            ICheckoutService checkoutService,
            BankPaymentService bankPaymentService)
        {
            _refundService = refundService;
            _currentUser = currentUser;
            _checkoutService = checkoutService;
            _bankPaymentService = bankPaymentService;
        }

        // ═══════════════════════════════════════════════════════════════
        //  USER ENDPOINTS
        // ═══════════════════════════════════════════════════════════════

        /// <summary>
        /// POST /api/refund
        /// Authenticated user submits a refund request for one course in a paid order.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateRefundRequest([FromBody] CreateRefundRequestDto dto)
        {
            var clerkUserId = _currentUser.UserId;
            if (string.IsNullOrEmpty(clerkUserId))
                return Unauthorized(new { success = false, message = "يرجى تسجيل الدخول." });

            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId);
            if (user == null)
                return BadRequest(new { success = false, message = "المستخدم غير موجود." });

            // Verify the order belongs to this user and is Paid
            var order = await _checkoutService.GetOrderByIdAsync(dto.OrderId);
            if (order == null || order.UserId != user.Id)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            if (order.Status != Domain.Enums.OrderStatus.Paid)
                return BadRequest(new { success = false, message = "يمكن طلب الاسترداد فقط للطلبات المدفوعة." });

            // Get the price for this course from the order
            var orderItem = order.Items.FirstOrDefault(i => i.PlanworkId == dto.PlanworkId);
            if (orderItem == null)
                return BadRequest(new { success = false, message = "الكورس غير موجود في هذا الطلب." });

            try
            {
                var refund = await _refundService.CreateAsync(
                    userId: user.Id,
                    orderId: dto.OrderId,
                    planworkId: dto.PlanworkId,
                    amount: orderItem.Price,
                    reason: dto.Reason,
                    details: dto.Details,
                    bankName: dto.BankName,
                    accountNumber: dto.AccountNumber,
                    accountHolder: dto.AccountHolder,
                    iban: dto.Iban
                );

                return Ok(new
                {
                    success = true,
                    message = "تم إرسال طلب الاسترداد بنجاح. سيتم مراجعته خلال 3-5 أيام عمل.",
                    data = MapToDto(refund)
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/refund/my
        /// Returns all refund requests submitted by the current user.
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRefunds()
        {
            var clerkUserId = _currentUser.UserId;
            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId ?? "");
            if (user == null)
                return Unauthorized();

            var requests = await _refundService.GetByUserIdAsync(user.Id);
            return Ok(new
            {
                success = true,
                data = requests.Select(MapToDto)
            });
        }

        /// <summary>
        /// GET /api/refund/{id}
        /// Returns a single refund request (owner or admin only).
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var clerkUserId = _currentUser.UserId;
            var user = await _checkoutService.GetUserByClerkIdAsync(clerkUserId ?? "");

            var request = await _refundService.GetByIdAsync(id);
            if (request == null)
                return NotFound(new { success = false, message = "الطلب غير موجود." });

            // Only owner or admin may view
            // Any authenticated user can view any request for now
            // (admin restriction will be added later)

            return Ok(new { success = true, data = MapToDto(request) });
        }

        // ═══════════════════════════════════════════════════════════════
        //  ADMIN ENDPOINTS
        // ═══════════════════════════════════════════════════════════════

        /// <summary>
        /// GET /api/refund/admin/all?status=Pending
        /// Admin — list all refund requests, optionally filtered by status.
        /// </summary>
        [HttpGet("admin/all")]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] string? status = null)
        {
            var requests = await _refundService.GetAllAsync(status);
            return Ok(new
            {
                success = true,
                total = requests.Count,
                data = requests.Select(MapToDto)
            });
        }

        /// <summary>
        /// PUT /api/refund/{id}/approve
        /// Admin approves a pending refund request → Status: Approved
        /// </summary>
        [HttpPut("{id:int}/approve")]
        [Authorize]
        public async Task<IActionResult> Approve(int id, [FromBody] ApproveRefundDto dto)
        {
            var (isSuccess, message) = await _refundService.ApproveAsync(id, dto.AdminNote);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        /// <summary>
        /// PUT /api/refund/{id}/reject
        /// Admin rejects a pending refund request → Status: Rejected
        /// </summary>
        [HttpPut("{id:int}/reject")]
        [Authorize]
        public async Task<IActionResult> Reject(int id, [FromBody] RejectRefundDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.RejectionReason))
                return BadRequest(new { success = false, message = "يجب ذكر سبب الرفض." });

            var (isSuccess, message) = await _refundService.RejectAsync(id, dto.RejectionReason);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        /// <summary>
        /// PUT /api/refund/{id}/sent
        /// Admin marks money as transferred → Status: Sent + cancels enrollment
        /// </summary>
        [HttpPut("{id:int}/sent")]
        [Authorize]
        public async Task<IActionResult> MarkAsSent(int id, [FromBody] MarkSentDto dto)
        {
            var (isSuccess, message) = await _refundService.MarkAsSentAsync(id, dto.AdminNote, _bankPaymentService);
            if (!isSuccess)
                return BadRequest(new { success = false, message });

            var request = await _refundService.GetByIdAsync(id);
            return Ok(new { success = true, message, data = MapToDto(request!) });
        }

        // ─── Helper mapper ─────────────────────────────────────────────
        private static RefundRequestResponseDto MapToDto(RefundRequest r) => new()
        {
            Id = r.Id,
            RefNumber = r.RefNumber,
            OrderId = r.OrderId,
            OrderNumber = r.Order?.OrderNumber,
            UserId = r.UserId,
            UserFullName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}".Trim() : null,
            UserEmail = r.User?.Email,
            PlanworkId = r.PlanworkId,
            CourseTitle = r.Planwork?.ServiceTitle,
            Amount = r.Amount,
            Currency = r.Currency,
            Reason = r.Reason,
            Details = r.Details,
            Status = r.Status,
            BankName = r.BankName,
            AccountNumber = r.AccountNumber,
            AccountHolder = r.AccountHolder,
            Iban = r.Iban,
            AdminNote = r.AdminNote,
            RejectionReason = r.RejectionReason,
            RequestedAt = r.RequestedAt,
            ApprovedAt = r.ApprovedAt,
            SentAt = r.SentAt,
            RejectedAt = r.RejectedAt
        };
    }
}