using Institute.Application.DTOs;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ILecturerService
    {
        // ── موجودين ──────────────────────────────────────────
        Task<IEnumerable<LecturerResponseDto>> GetAllAsync();
        Task<LecturerResponseDto?> GetByIdAsync(int id);

        // ── جديد ─────────────────────────────────────────────
        Task<LecturerResponseDto> CreateAsync(LecturerCreateUpdateDto dto);
        Task<LecturerResponseDto?> UpdateAsync(int id, LecturerCreateUpdateDto dto);
        Task<bool> DeleteAsync(int id);
        Task<string?> UploadPhotoAsync(int id, IFormFile photo, string uploadsFolder);
    }
}
