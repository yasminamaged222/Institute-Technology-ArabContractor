using Institute.Domain.Entities;

namespace Institute.API.Helpers
{
    public static class PlanworkExtensions
    {
        public static bool IsCourse(this Planwork p)
        => !string.IsNullOrWhiteSpace(p.CourseDesc);
    }
}
