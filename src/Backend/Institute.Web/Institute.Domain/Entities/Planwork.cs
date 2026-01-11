using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Planwork
{
    public int ChildId { get; set; }

    public int? ParentId { get; set; }

    public string? ServiceTitle { get; set; }

    public int? Priority { get; set; }

    public bool? MainFlag { get; set; }

    public bool? DetailsFlag { get; set; }

    public bool? SpecialFlag { get; set; }

    public string? CourseDesc { get; set; }

    public string? CoursePlace { get; set; }

    public string? CourseDate { get; set; }

    public string? CourseDays { get; set; }

    public string? CourseContent { get; set; }

    public string? PlanUser { get; set; }

    public string? PlanPass { get; set; }

    public decimal? PlanCost { get; set; }

    public bool? PlanSale { get; set; }
}
