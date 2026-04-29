// ══════════════════════════════════════════════════════════
// المسار: Institute.Application/Services/NewsService.cs
// ملف جديد — أضفه في نفس فولدر باقي الـ Services
// ══════════════════════════════════════════════════════════
using Institute.API.DTOs;
using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Institute.Application.Services
{
    public class NewsService : INewsService
    {
        private readonly IRepository<Dailynews> _newsRepo;
        private readonly IRepository<NewsPic> _picRepo;
        private readonly IConfiguration _config;

        public NewsService(
            IRepository<Dailynews> newsRepo,
            IRepository<NewsPic> picRepo,
            IConfiguration config)
        {
            _newsRepo = newsRepo;
            _picRepo = picRepo;
            _config = config;
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        public async Task<NewsCreateUpdateDto> CreateAsync(NewsCreateUpdateDto dto, string uploadsFolder)
        {
            var entity = new Dailynews
            {
                ATitel = dto.Title,
                ADetails = dto.Details,
                NewsDate = dto.Date,
                Approved = true
            };

            await _newsRepo.AddAsync(entity);
            await _newsRepo.SaveChangesAsync();

            // رفع الصورة لو موجودة
            string? imageUrl = null;
            if (dto.Image != null)
                imageUrl = await SaveImageAsync(entity.NewsId, dto.Image, uploadsFolder);

            return ToDto(entity, imageUrl);
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        public async Task<NewsCreateUpdateDto?> UpdateAsync(int id, NewsCreateUpdateDto dto, string uploadsFolder)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return null;

            entity.ATitel = dto.Title;
            entity.ADetails = dto.Details;
            entity.NewsDate = dto.Date;

            _newsRepo.Update(entity);
            await _newsRepo.SaveChangesAsync();

            // لو في صورة جديدة → احذف القديمة وارفع الجديدة
            string? imageUrl = null;
            if (dto.Image != null)
            {
                await DeleteOldImageAsync(id, uploadsFolder);
                imageUrl = await SaveImageAsync(id, dto.Image, uploadsFolder);
            }
            else
            {
                // احتفظ بالصورة الموجودة
                imageUrl = await GetExistingImageUrl(id);
            }

            return ToDto(entity, imageUrl);
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        public async Task<bool> DeleteAsync(int id, string uploadsFolder)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return false;

            // امسح كل الصور المرتبطة بالخبر ده
            await DeleteOldImageAsync(id, uploadsFolder);

            _newsRepo.Delete(entity);
            await _newsRepo.SaveChangesAsync();
            return true;
        }

        // ── PRIVATE HELPERS ───────────────────────────────────────────────────
        private async Task<string?> SaveImageAsync(int newsId, IFormFile image, string uploadsFolder)
        {
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            var pic = new NewsPic
            {
                NewsId = newsId,
                ImageName = fileName,
                StartUpPic = true,
                PicPeriorty = 1
            };
            await _picRepo.AddAsync(pic);
            await _picRepo.SaveChangesAsync();

            return $"{_config["ApiUrl"]}/images/news/{fileName}";
        }

        private async Task DeleteOldImageAsync(int newsId, string uploadsFolder)
        {
            var allPics = await _picRepo.GetAllAsync();
            var relatedPics = allPics.Where(p => p.NewsId == newsId).ToList();

            foreach (var pic in relatedPics)
            {
                if (!string.IsNullOrEmpty(pic.ImageName))
                {
                    var filePath = Path.Combine(uploadsFolder, pic.ImageName);
                    if (File.Exists(filePath)) File.Delete(filePath);
                }
                _picRepo.Delete(pic);
            }

            if (relatedPics.Any())
                await _picRepo.SaveChangesAsync();
        }

         
        private async Task<string?> GetExistingImageUrl(int newsId)
        {
            var allPics = await _picRepo.GetAllAsync();
            var firstPic = allPics
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .FirstOrDefault();

            if (firstPic?.ImageName == null) return null;
            return $"{_config["ApiUrl"]}/images/news/{firstPic.ImageName}";
        }
        private static NewsCreateUpdateDto ToDto(Dailynews entity, string? imageUrl) => new()
        {
            Id = entity.NewsId,
            Title = entity.ATitel,
            Details = entity.ADetails,
            Date = entity.NewsDate ?? DateTime.UtcNow,
            ImageUrl =  imageUrl  // الصورة ما بترجعش في الـ DTO ده، بس ممكن تضيف خاصية ImageUrl لو حبيت ترجعها
        };
    }
}