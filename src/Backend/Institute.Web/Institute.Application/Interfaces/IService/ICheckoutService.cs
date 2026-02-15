using Institute.Domain.Entities;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ICheckoutService
    {
        Task<Order> CreateOrderAsync(int userId);
        Task<Payment> ProcessPaymentAsync(int orderId, string transactionRef, string gatewayResponse, bool success);
        Task<AppUser> GetUserByClerkIdAsync(string clerkUserId);
    }
}
