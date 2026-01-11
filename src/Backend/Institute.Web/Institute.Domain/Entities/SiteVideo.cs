using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class SiteVideo
{
    public int VideoId { get; set; }

    public int? Priorit { get; set; }

    public string? VideoName { get; set; }

    public bool? Flag { get; set; }

    public string? VideoLink { get; set; }

    public string? VideoImg { get; set; }

    public int? VideoType { get; set; }

    public virtual SiteVideoType? VideoTypeNavigation { get; set; }
}
