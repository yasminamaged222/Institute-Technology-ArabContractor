using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class ErrorDesc
{
    public int Id { get; set; }

    public string? ErrorDesc1 { get; set; }

    public string? ErrorDate { get; set; }

    public int? ErrorUser { get; set; }
}
