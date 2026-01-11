using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class UsersLog
{
    public int LogId { get; set; }

    public int UserId { get; set; }

    public string FormId { get; set; } = null!;

    public int ActionId { get; set; }

    public string? ActionDate { get; set; }

    public string? UserIp { get; set; }

    public string? Pk1 { get; set; }

    public string? Pk2 { get; set; }

    public string? Pk3 { get; set; }

    public string? Pk4 { get; set; }
}
