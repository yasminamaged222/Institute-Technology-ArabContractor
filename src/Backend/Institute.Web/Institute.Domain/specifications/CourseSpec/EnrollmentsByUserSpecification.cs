using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.CourseSpec
{
    public class EnrollmentsByUserSpecification : BaseSpecification<Enrollment>
    {
        public EnrollmentsByUserSpecification(int userId)
            : base(e => e.UserId == userId)
        {
            AddInclude(e => e.Planwork); // نجيب الكورس معاه
        }
    }
}


