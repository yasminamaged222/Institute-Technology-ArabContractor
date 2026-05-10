using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
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

            string? blobName = null;

            if (dto.Image != null)
            {
                blobName = await _blobStorage.UploadFileAsync(
                    dto.Image,
                    Container,
                    Folder);

                await _picRepo.AddAsync(new NewsPic
                {
                    NewsId = entity.NewsId,
                    ImageName = blobName,
                    StartUpPic = true,
                    PicPeriorty = 1
                });

                await _picRepo.SaveChangesAsync();
            }

            return ToDto(entity, blobName);
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

            string? blobName = null;

            var pics = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == id)
                .ToList();

            foreach (var pic in pics)
                _picRepo.Delete(pic);

            if (pics.Any())
                await _picRepo.SaveChangesAsync();

            if (dto.Image != null)
            {
                blobName = await _blobStorage.UploadFileAsync(
                    dto.Image,
                    Container,
                    Folder);

                await _picRepo.AddAsync(new NewsPic
                {
                    NewsId = entity.NewsId,
                    ImageName = blobName,
                    StartUpPic = true,
                    PicPeriorty = 1
                });

                await _picRepo.SaveChangesAsync();
            }
            else
            {
                blobName = await GetExistingBlobName(id);
            }

            return ToDto(entity, blobName);
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

        // ── GET BLOB NAME ─────────────────────────
        private async Task<string?> GetExistingBlobName(int newsId)
        {
            var pic = (await _picRepo.GetAllAsync())
                .Where(p => p.NewsId == newsId)
                .OrderBy(p => p.PicPeriorty)
                .FirstOrDefault();

            return pic?.ImageName;
        }

        // ── BUILD URL (SAFE) ─────────────────────────
        private string? GetImageUrl(string? blobName)
        {
            if (string.IsNullOrWhiteSpace(blobName))
                return null;

            var baseUrl = _config["AzureBlobStorage:BaseUrl"];

            return $"{baseUrl?.TrimEnd('/')}/news/{blobName.TrimStart('/')}";
        }

        // ── DTO ───────────────────────────────
        private NewsCreateUpdateDto ToDto(
            Dailynews entity,
            string? blobName)
        {
            return new NewsCreateUpdateDto
            {
                Id = entity.NewsId,
                Title = entity.ATitel,
                Details = entity.ADetails,
                Date = entity.NewsDate ?? DateTime.UtcNow,
                ImageUrl = GetImageUrl(blobName)
            };
        }
    }
}