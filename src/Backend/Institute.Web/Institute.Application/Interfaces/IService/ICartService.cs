using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ICartService
    {
        Task<Cart> GetUserCartAsync(string clerkUserId);
        Task AddToCartAsync(string clerkUserId, int planworkId);
        Task RemoveFromCartAsync(string clerkUserId, int planworkId);
    }
}
