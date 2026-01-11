using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Institute.Infrastructure;

public partial class CoursePurchase
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int PlanworkId { get; set; }

    public DateTime PurchaseDate { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TotalPrice { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("CoursePurchases")]
    public virtual AppUser User { get; set; } = null!;
}
