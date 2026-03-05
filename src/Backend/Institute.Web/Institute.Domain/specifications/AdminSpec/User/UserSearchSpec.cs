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
        
            public UserSearchSpec(UserSpecParams param)
                : base(u =>
                    // Keyword filter
                    (string.IsNullOrEmpty(param.Search) ||
                     u.Username.ToLower().Contains(param.Search.ToLower()) ||
                     (u.Email != null && u.Email.ToLower().Contains(param.Search.ToLower())))

                    &&
                    // FromDate filter
                    (!param.FromDate.HasValue ||
                     u.Enrollments.Any(e => e.EnrolledAt >= param.FromDate.Value))

                    &&
                    // ToDate filter
                    (!param.ToDate.HasValue ||
                     u.Enrollments.Any(e => e.EnrolledAt <= param.ToDate.Value))
                )
            {
                // Include enrollments and planworks
                AddInclude(u => u.Enrollments);
                AddInclude("Enrollments.Planwork");

                // Pagination (تعليق مؤقت، ممكن تفعيله لو مش للCount)
                // ApplyPagination((param.PageIndex - 1) * param.PageSize, param.PageSize);
            }
        
    }
}
