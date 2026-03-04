using Institute.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// Ensure that Planwork is a class, not a namespace.
// If Planwork is a namespace, you need to reference the correct class, e.g., Institute.Domain.Entities.Planwork.

namespace Institute.Domain.specifications.AdminSpec.Course
{
    public class PlanworkSearchSpec : BaseSpecification<Planwork>
    {
        public PlanworkSearchSpec(string keyword)
            : base(u => EF.Functions.Like(u.ServiceTitle, $"%{keyword}%")) 
        {
            // Include enrollments and the users inside
            AddInclude(p => p.Enrollments);
            AddInclude("Enrollments.User");
        }
    }
}
