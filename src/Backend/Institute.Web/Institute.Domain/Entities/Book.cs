using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Book
{
    public int BookId { get; set; }

    public int TypeId { get; set; }

    public string BookName { get; set; } = null!;

    public string? Author { get; set; }

    public int? BookDate { get; set; }
    // Navigation Property
    public BooksType BooksType { get; set; }

}
