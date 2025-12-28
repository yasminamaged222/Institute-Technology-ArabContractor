using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class NewsPic
{
    public int NewsId { get; set; }

    public int PicId { get; set; }

    public string? ImageName { get; set; }

    public bool? StartUpPic { get; set; }

    public int? PicPeriorty { get; set; }

    public string? ArComment { get; set; }
}
