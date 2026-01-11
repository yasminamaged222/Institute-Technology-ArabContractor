using Institute.Domain.specifications;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Infrastructure
{
    public class SpecificationEvaluator<T> where T : class
    {
        public static IQueryable<T> GetQuery(
            IQueryable<T> inputQuery,
            Ispecification<T> spec)
        {
            var query = inputQuery;

            // Where
            if (spec.Criteria != null)
            {
                query = query.Where(spec.Criteria);
            }

            // Include
            query = spec.Includes.Aggregate(
                query,
                (current, include) => current.Include(include));

            // OrderBy
            if (spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy);
            }

            if (spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            // Paging
            if (spec.IsPaginationEnabled)
            {
                query = query
                    .Skip(spec.Skip)
                    .Take(spec.Take);
            }

            return query;
        }
    }

}
