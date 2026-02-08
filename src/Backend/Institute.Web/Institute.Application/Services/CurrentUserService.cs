using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Institute.Application.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _context;

        public CurrentUserService(IHttpContextAccessor context)
        {
            _context = context;
        }

        public string? UserId =>
            _context.HttpContext?.User?.FindFirst("sub")?.Value;
    }
}
