using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.CourseSpec
{
    public class TrainingPlanSpec : BaseSpecification<Planwork>
    {
        public TrainingPlanSpec()
        {
            AddOrderBy(x => x.Priority);

            AddInclude(x => x.Files); // لو Navigation Property موجودة
        }
    }
}
