using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec
{
    public class AttendedEnrollmentsSpec : BaseSpecification<Enrollment>
    {
        public AttendedEnrollmentsSpec()
            : base(e => e.Attended) // only select enrollments where Attended = true
        {
        }
    }
}
