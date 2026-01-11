using System;
using System.Collections.Generic;

namespace Institute.Domain.Entities;

public partial class Lecturer
{
    public int LecturerId { get; set; }

    public string LecturerName { get; set; } = null!;

    public string? LecturerPic { get; set; }

    public string? LecturerCourse { get; set; }

    public string? LecturerMainEdu { get; set; }

    public string? LecturerEdu { get; set; }

    public string? LecturerDetails { get; set; }

    public string? Telephone { get; set; }

    public string? Email { get; set; }
}
