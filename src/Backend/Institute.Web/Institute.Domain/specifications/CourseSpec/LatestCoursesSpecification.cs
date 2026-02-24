using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.CourseSpec
{
    public class LatestCoursesSpecification : BaseSpecification<Planwork>
    {
        public LatestCoursesSpecification(int takeCount)
            : base(p => !string.IsNullOrEmpty(p.CourseDesc)) // لو عندك شرط للكورسات الرئيسية
        {
            AddOrderByDescending(p => p.CourseDate);
            ApplyPaging(0, takeCount);
        }
    }
}
