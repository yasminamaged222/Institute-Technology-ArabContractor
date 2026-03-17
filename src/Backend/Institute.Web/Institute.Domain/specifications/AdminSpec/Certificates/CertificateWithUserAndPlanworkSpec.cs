using Institute.Domain.Entities;
using Institute.Domain.specifications.AdminSpec.Certificates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Certificates
{
    public class CertificateWithUserAndPlanworkSpec : BaseSpecification<Certificate>
    {
        public CertificateWithUserAndPlanworkSpec(int userId, int planworkId)
        : base(c => c.UserId == userId && c.PlanworkId == planworkId)
        {
            AddInclude(c => c.User);
            AddInclude(c => c.Planwork);
        }
    }
}
