using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Form
{
    public int FormId { get; set; }

    public int? CatId { get; set; }

    public string? FormName { get; set; }

    public string? FormTables { get; set; }

    public string? FormDesc { get; set; }

    public bool? ViewFlag { get; set; }
}
