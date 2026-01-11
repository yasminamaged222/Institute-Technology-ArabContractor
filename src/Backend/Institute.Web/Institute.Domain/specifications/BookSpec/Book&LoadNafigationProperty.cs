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
        public Book_LoadNafigationProperty() : base()
        {
            // Include للـ Navigation Property فقط
            AddInclude(b => b.BooksType); // عشان TypeName يشتغل في DTO)
            // خصائص عادية زي BookName, Author, BookDate مش محتاجين Include
        }
    }
}
