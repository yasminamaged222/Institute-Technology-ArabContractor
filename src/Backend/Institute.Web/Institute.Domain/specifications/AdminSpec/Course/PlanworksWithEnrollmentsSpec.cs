using Institute.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Institute.Domain.specifications.AdminSpec.Course
{
    public class PlanworksWithEnrollmentsSpec : BaseSpecification<Planwork>
    {
        public PlanworksWithEnrollmentsSpec()
        {
            // Include Enrollments
            AddInclude(p => p.Enrollments);
            // Include the User inside each Enrollment
            AddInclude("Enrollments.User");
        }
    }
}