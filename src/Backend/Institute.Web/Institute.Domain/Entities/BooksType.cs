using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class BooksType
{
    public int TypeId { get; set; }

    public string? TypeName { get; set; }
    public ICollection<Book> Books { get; set; } = new List<Book>();
}
