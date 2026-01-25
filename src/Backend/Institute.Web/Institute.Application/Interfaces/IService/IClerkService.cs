using Institute.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface IClerkService
    {
        Task<ClerkUserDto?> GetUserAsync(string clerkUserId);

    }
}
