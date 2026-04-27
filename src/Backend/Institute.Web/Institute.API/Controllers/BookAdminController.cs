using Institute.Application.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Institute.API.Controllers
{
    [HasPermission("Books")]
    [Route("api/admin/[controller]")]
    [ApiController]
    public class BookAdminController : ControllerBase
    {
    }
}
