using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.User
{
    public class UsersWithEnrollmentsSpec : BaseSpecification<AppUser>
    {
        public UsersWithEnrollmentsSpec()
        {
            AddInclude(u => u.Enrollments);
            AddInclude("Enrollments.Planwork");

            AddOrderByDescending(u => u.CreatedAt);
        }
    }
}
