using Institute.Application.DTOs;
using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Interfaces.IService
{
    public interface ICategoryService
    {
        Task<List<CategoryTreeDto>> GetCategoryTreeAsync();
        Task<IReadOnlyList<Planwork>> GetLatestCoursesAsync(int count);
    }
}
