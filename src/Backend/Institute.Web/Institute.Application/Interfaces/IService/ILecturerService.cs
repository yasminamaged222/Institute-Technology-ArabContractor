using Institute.Infrastructure.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ILecturerService
    {
        Task<IEnumerable<LecturerResponseDto>> GetAllAsync();
        Task<LecturerResponseDto?> GetByIdAsync(int id);
    }
}
