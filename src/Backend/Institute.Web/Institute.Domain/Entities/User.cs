using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string? UserLogName { get; set; }

    public string? UserFullName { get; set; }

    public string? UserPassword { get; set; }

    public string? UserEmail { get; set; }

    public DateTime? StartAccountDate { get; set; }

    public DateTime? EndAccountDate { get; set; }

    public Guid PasswordSalt { get; set; }

    public byte[]? PasswordHash { get; set; }
}
