using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class PlanFile
{
    public int PlanId { get; set; }

    public int FileId { get; set; }

    public string? FileTitle { get; set; }

    public string? FileName { get; set; }

    public int? FilePeriorty { get; set; }
}
