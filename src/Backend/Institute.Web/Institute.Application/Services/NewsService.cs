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
        private readonly IBlobStorage _blobStorage;
        private readonly IConfiguration _config;

        private const string Container = "icemt";
        private const string Folder = "news";

        public NewsService(
            IRepository<Dailynews> newsRepo,
            IRepository<NewsPic> picRepo,
            IBlobStorage blobStorage,
            IConfiguration config)
        {
            _newsRepo = newsRepo;
            _picRepo = picRepo;
            _blobStorage = blobStorage;
            _config = config;
        }

        // ── CREATE ───────────────────────────────
        public async Task<NewsCreateUpdateDto> CreateAsync(NewsCreateUpdateDto dto)
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

            if (dto.Images != null && dto.Images.Any())
                await UploadAndSavePicsAsync(entity.NewsId, dto.Images);

            var blobNames = await GetExistingBlobNames(entity.NewsId);

            return ToDto(entity, blobNames);
        }

        // ── UPDATE ───────────────────────────────
        public async Task<NewsCreateUpdateDto?> UpdateAsync(int id, NewsCreateUpdateDto dto)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return null;

            entity.ATitel = dto.Title;
            entity.ADetails = dto.Details;
            entity.NewsDate = dto.Date;

            _newsRepo.Update(entity);
            await _newsRepo.SaveChangesAsync();

            // ✅ لو في صور جديدة — رفعهم بس من غير ما نمسح القديمة
            if (dto.Images != null && dto.Images.Any())
            {
                // ✅ أول priority للصور الجديدة بعد آخر واحدة موجودة
                var lastPriority = (await _picRepo.GetAllAsync())
                    .Where(p => p.NewsId == id)
                    .OrderByDescending(p => p.PicPeriorty)
                    .FirstOrDefault()?.PicPeriorty ?? 0;

                await UploadAndSavePicsAsync(entity.NewsId, dto.Images, lastPriority);
            }

            var blobNames = await GetExistingBlobNames(entity.NewsId);

            return ToDto(entity, blobNames);
        }

        // ── DELETE ───────────────────────────────
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _newsRepo.GetByIdAsync(id);
            if (entity == null) return false;

            var pics = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == id)
                .ToList();

            foreach (var pic in pics)
                _picRepo.Delete(pic);

            if (pics.Any())
                await _picRepo.SaveChangesAsync();

            _newsRepo.Delete(entity);
            await _newsRepo.SaveChangesAsync();

            return true;
        }

        // ── UPLOAD MULTIPLE IMAGES ────────────────────────
        private async Task UploadAndSavePicsAsync(
            int newsId,
            List<IFormFile> images,
            int startPriority = 0)
        {
            int priority = startPriority + 1;

            foreach (var image in images)
            {
                var blobPath = await _blobStorage.UploadFileAsync(image, Container, Folder);

                // ✅ حفظ اسم الملف بس في الـ DB بدون المسار
                var fileName = Path.GetFileName(blobPath);

                await _picRepo.AddAsync(new NewsPic
                {
                    NewsId = newsId,
                    ImageName = fileName,
                    // ✅ أول صورة في الـ Create بس هي الرئيسية
                    StartUpPic = priority == 1,
                    PicPeriorty = priority++
                });
            }

            await _picRepo.SaveChangesAsync();
        }

        // ── GET ALL EXISTING BLOB NAMES ───────────────────
        private async Task<List<string?>> GetExistingBlobNames(int newsId)
        {
            return (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .Select(p => p.ImageName)
                .ToList();
        }

        // ── GET BLOB NAME (موجودة — مش بنمسحها) ──────────
        private async Task<string?> GetExistingBlobName(int newsId)
        {
            var pic = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .FirstOrDefault();

            return pic?.ImageName;
        }

        // ── Get URL (safe) ────────────────
        private string? GetImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            var baseUrl = _config["AzureStorage:BaseUrl"];

            return $"{baseUrl?.TrimEnd('/')}/news/{blobName.TrimStart('/')}";
        }

        // ── DTO ───────────────────────────────
        private NewsCreateUpdateDto ToDto(
            Dailynews entity,
            List<string?> blobNames)
        {
            return new NewsCreateUpdateDto
            {
                Id = entity.NewsId,
                Title = entity.ATitel,
                Details = entity.ADetails,
                Date = entity.NewsDate ?? DateTime.UtcNow,
                // ✅ بيرجع اسم الملف بس — الـ Controller هو اللي يبني الـ URL
                ImageUrl = blobNames.FirstOrDefault(),
                ImageUrls = blobNames
            };
        }
    }
}