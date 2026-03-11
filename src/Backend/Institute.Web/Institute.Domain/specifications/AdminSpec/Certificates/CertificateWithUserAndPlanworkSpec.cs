using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.Certificates
{
    public class CertificateWithUserAndPlanworkSpec : BaseSpecification<Certificate>
    {
        public CertificateWithUserAndPlanworkSpec()
        {
            AddInclude(c => c.User);
            AddInclude(c => c.Planwork);
        }
    }
}
