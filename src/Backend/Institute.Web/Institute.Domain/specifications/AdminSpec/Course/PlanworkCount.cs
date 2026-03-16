using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Course
{
    public class PlanworkCount : BaseSpecification<Planwork>
    {
        public PlanworkCount() : base(p=>p.CourseDate != null)
        {

        }
    }
}
