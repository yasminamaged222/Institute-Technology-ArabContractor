using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class GetNewsDetailsView
{
    public int NewsId { get; set; }

    public int? Day { get; set; }

    public string? Month { get; set; }

    public int? Year { get; set; }

    public string? ATitel { get; set; }

    public string? Details { get; set; }

    public DateTime? NewsDate { get; set; }

    public string? NewsDate1 { get; set; }

    public int? Expr1 { get; set; }

    public string? ADetails { get; set; }
}
