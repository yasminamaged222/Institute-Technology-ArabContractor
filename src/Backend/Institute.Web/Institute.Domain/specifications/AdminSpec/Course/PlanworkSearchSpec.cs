using Institute.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Institute.Domain.specifications.AdminSpec.Course
{
    public class PlanworkSearchSpec : BaseSpecification<Planwork>
    {
        public PlanworkSearchSpec(PlanworkSpecParams param)
        : base(p =>
            p.CourseDate != null &&
            (string.IsNullOrEmpty(param.Search) ||
             EF.Functions.Like(p.ServiceTitle, $"%{param.Search}%")) &&

            (!param.FromDate.HasValue ||
             p.Enrollments.Any(e => e.EnrolledAt >= param.FromDate)) &&

            (!param.ToDate.HasValue ||
             p.Enrollments.Any(e => e.EnrolledAt <= param.ToDate))
        )
        {
            AddInclude(p => p.Enrollments);
            AddInclude("Enrollments.User");

            //ApplyPaging(
            //    (param.PageIndex - 1) * param.PageSize,
            //    param.PageSize
            //);
        }
    }
}
