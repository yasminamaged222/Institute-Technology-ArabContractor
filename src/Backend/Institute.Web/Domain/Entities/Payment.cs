using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Institute.Infrastructure;

public partial class Payment
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    public DateTime PaymentDate { get; set; }

    [StringLength(50)]
    public string PaymentMethod { get; set; } = null!;

    [StringLength(100)]
    public string TransactionId { get; set; } = null!;

    [StringLength(50)]
    public string Status { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("Payments")]
    public virtual AppUser User { get; set; } = null!;
}
