using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Institute.Application.Interfaces.IService;

namespace Institute.Application.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContext;

        public CurrentUserService(IHttpContextAccessor httpContext)
        {
            _httpContext = httpContext;
        }

        public string ClerkUserId =>
         _httpContext.HttpContext?
             .User
             .Claims
             .FirstOrDefault(x => x.Type == "sub")?
             .Value!;

    }
}
//< ItemGroup >

//        < FrameworkReference Include = "Microsoft.AspNetCore.App" />

//    </ ItemGroup >
