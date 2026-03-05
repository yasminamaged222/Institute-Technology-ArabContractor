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
        public PlanworkSearchSpec(string? keyword, DateTime? fromDate, DateTime? toDate)
            : base(p =>
                (string.IsNullOrEmpty(keyword) || EF.Functions.Like(p.ServiceTitle, $"%{keyword}%")) &&
                (!fromDate.HasValue || p.Enrollments.Any(e => e.EnrolledAt >= fromDate)) &&
                (!toDate.HasValue || p.Enrollments.Any(e => e.EnrolledAt <= toDate))
            )
        {
            AddInclude(p => p.Enrollments);
            AddInclude("Enrollments.User");
        }
    }
}
