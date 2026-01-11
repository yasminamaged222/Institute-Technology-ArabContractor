using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class UsersFormsView
{
    public int UserId { get; set; }

    public int FormId { get; set; }

    public string? UserLogName { get; set; }

    public string? UserPassword { get; set; }

    public string? UserFullName { get; set; }

    public string? FormName { get; set; }

    public string? UserEmail { get; set; }

    public int Expr1 { get; set; }
}
