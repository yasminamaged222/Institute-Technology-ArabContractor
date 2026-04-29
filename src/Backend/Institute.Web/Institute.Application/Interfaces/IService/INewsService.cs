// ══════════════════════════════════════════════════════════
// المسار: Institute.Application/Interfaces/IService/INewsService.cs
// ملف جديد — أضفه في نفس فولدر باقي الـ Interfaces
// ══════════════════════════════════════════════════════════
using Institute.API.DTOs;
using Institute.Application.DTOs;

namespace Institute.Application.Interfaces.IService
{
    public interface INewsService
    {
        Task<NewsCreateUpdateDto> CreateAsync(NewsCreateUpdateDto dto, string uploadsFolder);
        Task<NewsCreateUpdateDto?> UpdateAsync(int id, NewsCreateUpdateDto dto, string uploadsFolder);
        Task<bool> DeleteAsync(int id, string uploadsFolder);
    }
}