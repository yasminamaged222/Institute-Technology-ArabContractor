using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.NewsSpec
{
    public class NewsWithFiltersForCountSpec
    : BaseSpecification<Dailynews>
    {
        public NewsWithFiltersForCountSpec(NewsSpecParams newsParams)
            : base(x =>
                (!newsParams.Year.HasValue ||
                 (x.NewsDate.HasValue &&
                  x.NewsDate.Value.Year == newsParams.Year)))
        {
        }
    }

}
