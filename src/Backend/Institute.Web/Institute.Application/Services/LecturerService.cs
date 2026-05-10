using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Infrastructure.DTOs;
using Microsoft.AspNetCore.Http;

namespace Institute.Application.Services
{
    public class LecturerService : ILecturerService
    {
        private readonly IRepository<Lecturer> _repo;

        public LecturerService(IRepository<Lecturer> repo)
        {
            _repo = repo;
        }

        // ── Mapping helper ────────────────────────────────────────────────────
        private static LecturerResponseDto ToDto(Lecturer l) => new()
        {
            Id = l.LecturerId,
            Name = l.LecturerName,
            Pic = l.LecturerPic,
            Course = l.LecturerCourse,
            MainEdu = l.LecturerMainEdu,
            Edu = l.LecturerEdu,
            Details = l.LecturerDetails,
            Telephone = l.Telephone,
            Email = l.Email
        };

        // ── GET ALL ───────────────────────────────────────────────────────────
        public async Task<IEnumerable<LecturerResponseDto>> GetAllAsync()
        {
            var lecturers = await _repo.GetAllAsync();
            return lecturers.Select(ToDto);
        }

        // ── GET BY ID ─────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto?> GetByIdAsync(int id)
        {
            var l = await _repo.GetByIdAsync(id);
            return l == null ? null : ToDto(l);
        }

        // ── CREATE ────────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto> CreateAsync(LecturerCreateUpdateDto dto)
        {
            var entity = new Lecturer
            {
                LecturerName = dto.Name,
                LecturerMainEdu = dto.Specialty,
                LecturerCourse = dto.Courses,
                LecturerEdu = dto.Level,
                LecturerDetails = dto.Details,
                Telephone = dto.Phone,
                Email = dto.Email
            };

            await _repo.AddAsync(entity);
            await _repo.SaveChangesAsync();
            return ToDto(entity);
        }

        // ── UPDATE ────────────────────────────────────────────────────────────
        public async Task<LecturerResponseDto?> UpdateAsync(int id, LecturerCreateUpdateDto dto)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return null;

            entity.LecturerName = dto.Name;
            entity.LecturerMainEdu = dto.Specialty;
            entity.LecturerCourse = dto.Courses;
            entity.LecturerEdu = dto.Level;
            entity.LecturerDetails = dto.Details;
            entity.Telephone = dto.Phone;
            entity.Email = dto.Email;

            _repo.Update(entity);
            await _repo.SaveChangesAsync();
            return ToDto(entity);
        }

        // ── DELETE ────────────────────────────────────────────────────────────
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return false;

            // امسح الصورة من الديسك لو موجودة
            if (!string.IsNullOrEmpty(entity.LecturerPic))
            {
                var filePath = Path.Combine(
                    "D:\\home\\site\\userfiles\\icemt\\assets\\images",
                    Path.GetFileName(entity.LecturerPic)
                );
                if (File.Exists(filePath)) File.Delete(filePath);
            }

            _repo.Delete(entity);
            await _repo.SaveChangesAsync();
            return true;
        }

        // ── UPLOAD PHOTO ──────────────────────────────────────────────────────
        public async Task<string?> UploadPhotoAsync(int id, IFormFile photo, string uploadsFolder)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null) return null;

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // امسح الصورة القديمة لو موجودة
            if (!string.IsNullOrEmpty(entity.LecturerPic))
            {
                var oldPath = Path.Combine(uploadsFolder, Path.GetFileName(entity.LecturerPic));
                if (File.Exists(oldPath)) File.Delete(oldPath);
            }

            // احفظ اسم الملف بس (بدون path) زي باقي الصور في الـ DB
            var fileName = Guid.NewGuid() + Path.GetExtension(photo.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await photo.CopyToAsync(stream);

            // ✅ اسم الملف بس — مش /images/lecturers/...
            entity.LecturerPic = fileName;
            _repo.Update(entity);
            await _repo.SaveChangesAsync();

            return fileName;
        }
    }
}