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
        public UserSearchSpec(string? keyword, DateTime? fromDate, DateTime? toDate)
        : base(u =>
            (string.IsNullOrEmpty(keyword) ||
             u.Username.ToLower().Contains(keyword.ToLower()) ||
             (u.Email != null && u.Email.ToLower().Contains(keyword.ToLower())))

            &&
            (!fromDate.HasValue || u.Enrollments.Any(e => e.EnrolledAt >= fromDate)) &&
            (!toDate.HasValue || u.Enrollments.Any(e => e.EnrolledAt <= toDate))
        )
        {
            AddInclude(u => u.Enrollments);
            AddInclude("Enrollments.Planwork");
        }
    }
}
