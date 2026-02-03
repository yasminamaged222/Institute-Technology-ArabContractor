using Institute.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.specifications.BookSpec
{
    public class Book_LoadNafigationProperty : BaseSpecification<Book>
    {
        public Book_LoadNafigationProperty(BookSpecParams bookParams)
            : base(b =>
                string.IsNullOrEmpty(bookParams.Search) ||
                b.BookName.ToLower().Contains(bookParams.Search))
        {
            // ✅ Include Navigation Property
            AddInclude(b => b.BooksType);

            // ✅ Pagination
            ApplyPaging(
                (bookParams.PageIndex - 1) * bookParams.PageSize,
                bookParams.PageSize
            );

            // ✅ Sorting (اختياري)
            AddOrderBy(b => b.BookName);
        }

        // ✅ Spec تاني للـ Count
        public Book_LoadNafigationProperty(BookSpecParams bookParams, bool isCount)
            : base(b =>
                string.IsNullOrEmpty(bookParams.Search) ||
                b.BookName.ToLower().Contains(bookParams.Search))
        {
            // ❌ مفيش Include
            // ❌ مفيش Pagination
        }
    }
}
