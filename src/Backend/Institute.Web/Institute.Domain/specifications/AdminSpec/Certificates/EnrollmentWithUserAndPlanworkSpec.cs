using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Certificates
{
    public class EnrollmentWithUserAndPlanworkSpec : BaseSpecification<Enrollment>
    {
        public EnrollmentWithUserAndPlanworkSpec() : base()
        {
            AddInclude(e => e.User);
            AddInclude(e => e.Planwork);
        }
    }
}
