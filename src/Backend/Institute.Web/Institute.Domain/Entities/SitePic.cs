using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class SitePic
{
    public int ImageId { get; set; }

    public int? Priorit { get; set; }

    public string? PicName { get; set; }

    public bool? Flag { get; set; }

    public string? PageLink { get; set; }
}
