using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class SiteVideoType
{
    public int Code { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<SiteVideo> SiteVideos { get; set; } = new List<SiteVideo>();
}
