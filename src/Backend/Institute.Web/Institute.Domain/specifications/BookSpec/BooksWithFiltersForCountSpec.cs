using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.BookSpec
{
    public class BooksWithFiltersForCountSpec : BaseSpecification<Book>
    {
        public BooksWithFiltersForCountSpec(BookSpecParams bookParams)
            : base(b =>
                string.IsNullOrEmpty(bookParams.Search) ||
                b.BookName.ToLower().Contains(bookParams.Search))
        {
        }
    }
}
