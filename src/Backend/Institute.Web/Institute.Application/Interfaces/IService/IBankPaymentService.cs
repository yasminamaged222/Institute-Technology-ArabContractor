using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    internal interface IBankPaymentService
    {
        Task<string> InitiateCheckoutAsync(int orderId, decimal amount);
        Task<bool> VerifyPaymentAsync(string orderId);
    }
}
