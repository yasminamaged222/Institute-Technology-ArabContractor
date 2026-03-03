using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.AdminSpec.User
{
    public class UserSearchSpec : BaseSpecification<AppUser>
    {
        public UserSearchSpec(string keyword)
        : base(u =>
                u.Username.ToLower().Contains(keyword.ToLower()) ||
                (u.Email != null && u.Email.ToLower().Contains(keyword.ToLower())))
        {
            AddInclude(u => u.Enrollments);
            AddInclude("Enrollments.Planwork");
        }
    }
}
