using Institute.Application.DTOs.AdminDtos;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Planfiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class PlanFileService : IPlanFileService
    {
        private readonly IRepository<PlanFile> _planFileRepo;

        public PlanFileService(IRepository<PlanFile> planFileRepo)
        {
            _planFileRepo = planFileRepo;
        }

        public async Task<IEnumerable<PlanFileDto>> GetFilesAsync(int planId)
        {
            var spec = new PlanFilesByPlanIdSpec(planId);

            var files = await _planFileRepo.GetAllWithSpecAsync(spec);

            return files.Select(x => new PlanFileDto
            {
                PlanId = x.PlanId,
                FileId = x.FileId,
                FileTitle = x.FileTitle,
                FileName = x.FileName,
                FilePeriorty = x.FilePeriorty
            });
        }

        public async Task AddAsync(CreatePlanFileDto dto)
        {
            var spec = new PlanFilesByPlanIdSpec(dto.PlanId);

            var existingFiles =
                await _planFileRepo.GetAllWithSpecAsync(spec);

            int nextFileId = existingFiles.Any()
                ? existingFiles.Max(x => x.FileId) + 1
                : 1;

            // save physical file
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/files");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName =
                Guid.NewGuid() +
                Path.GetExtension(dto.File.FileName);

            var filePath =
                Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var planFile = new PlanFile
            {
                PlanId = dto.PlanId,
                FileId = nextFileId,
                FileTitle = dto.FileTitle,
                FilePeriorty = dto.FilePeriorty,
                FileName = uniqueFileName
            };

            await _planFileRepo.AddAsync(planFile);

            await _planFileRepo.SaveChangesAsync();
        }

        public async Task DeleteAsync(int planId, int fileId)
        {
            var spec = new PlanFileByIdSpec(planId, fileId);

            var file =
                await _planFileRepo.GetByIdWithSpecAsync(spec);

            if (file == null)
                throw new Exception("File not found");

            // delete physical file
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/files",
                file.FileName!);

            if (File.Exists(filePath))
                File.Delete(filePath);

            _planFileRepo.Delete(file);

            await _planFileRepo.SaveChangesAsync();
        }
    }
}
