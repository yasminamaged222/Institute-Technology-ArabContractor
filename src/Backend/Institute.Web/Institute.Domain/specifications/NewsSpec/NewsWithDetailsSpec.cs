using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.NewsSpec
{
    public class NewsWithDetailsSpec : BaseSpecification<Dailynews>
    {
        public NewsWithDetailsSpec(int id)
        : base(x => x.NewsId == id)
        {
            AddInclude(x => x.NewsPics);

        }
    }

}
