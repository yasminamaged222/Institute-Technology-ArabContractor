using Institute.Application.Services;
using Institute.Domain.Entities;

namespace Institute.Application.Interfaces.IService
{
    public interface IRefundService
    {
        /// <summary>User submits a new refund request.</summary>
        Task<RefundRequest> CreateAsync(
            int userId,
            int orderId,
            int planworkId,
            decimal amount,
            string reason,
            string? details,
            string? bankName,
            string? accountNumber,
            string? accountHolder,
            string? iban);

        /// <summary>Get one request by id.</summary>
        Task<RefundRequest?> GetByIdAsync(int id);

        /// <summary>All requests (admin view) — optional status filter.</summary>
        Task<IReadOnlyList<RefundRequest>> GetAllAsync(string? statusFilter = null);

        /// <summary>All requests for a specific user.</summary>
        Task<IReadOnlyList<RefundRequest>> GetByUserIdAsync(int userId);

        /// <summary>Admin approves → Status = Approved.</summary>
        Task<(bool IsSuccess, string Message)> ApproveAsync(int id, string? adminNote);

        /// <summary>Admin rejects → Status = Rejected.</summary>
        Task<(bool IsSuccess, string Message)> RejectAsync(int id, string rejectionReason);

        /// <summary>Admin marks money as sent → calls bank → Status = Sent.</summary>
        Task<(bool IsSuccess, string Message)> MarkAsSentAsync(int id, string? adminNote, BankPaymentService bankService);
    }
}