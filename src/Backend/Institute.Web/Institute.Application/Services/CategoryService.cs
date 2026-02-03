using Institute.Application.DTOs;
using Institute.Application.Interfaces;
using Institute.Application.Interfaces.IService;
using Institute.Domain.Entities;
using Institute.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Planwork> _planworkRepository;

        public CategoryService(IRepository<Planwork> planworkRepository)
        {
            _planworkRepository = planworkRepository;
        }

        public async Task<List<CategoryTreeDto>> GetCategoryTreeAsync()
        {

            // 1️⃣ Get all categories (no courses)
            var allPlanworks = await _planworkRepository.GetAllAsync();

            var categories = allPlanworks
                .Where(x => x.CourseDesc == null)
                .Where(x => x.MainFlag ==true)
                .OrderBy(x => x.Priority)
                .ToList();

            // 2️⃣ Build tree
            List<CategoryTreeDto> Build(int? parentId)
            {
                return categories
                    .Where(x => x.ParentId == parentId)
                    .OrderBy(x => x.Priority ?? int.MaxValue)
                    .Select(x => new CategoryTreeDto
                    {
                        Id = x.ChildId,
                        Title = x.ServiceTitle,
                        Children = Build(x.ChildId)
                    })
                    .ToList();
            }

            // 3️⃣ Root nodes
            return Build(null);
        }

    }
}
