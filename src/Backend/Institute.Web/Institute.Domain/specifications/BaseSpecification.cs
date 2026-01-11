using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications
{
    public class BaseSpecification<T> : Ispecification<T> where T : class
    {

        public Expression<Func<T, bool>> Criteria { get; set; }
        public List<Expression<Func<T, object>>> Includes { get; set; } = new List<Expression<Func<T, object>>>();

        public Expression<Func<T, object>> OrderBy { get; set; }
        public Expression<Func<T, object>> OrderByDescending { get; set; }

        public int Take { get; set; }
        public int Skip { get; set; }
        public bool IsPaginationEnabled { get; set; }

        public BaseSpecification()
        {
            //Criteria = null;
        }
        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        public void AddInclude(Expression<Func<T, object>> includeExpression)
            => Includes.Add(includeExpression);
        public void AddOrderBy(Expression<Func<T, object>> orderByExpression)
            => OrderBy = orderByExpression;
        public void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
            => OrderByDescending = orderByDescExpression;
        public void ApplyPagination(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPaginationEnabled = true;
        }
        public void ApplyPaging(int skip, int take)
        {
            ApplyPagination(skip, take);
        }
    }
}
