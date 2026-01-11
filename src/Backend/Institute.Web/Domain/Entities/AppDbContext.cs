using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Institute.Infrastructure;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    public virtual DbSet<CoursePurchase> CoursePurchases { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AppUsers__3214EC0738C9CA14");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<CoursePurchase>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CoursePu__3214EC07DF70FC49");

            entity.Property(e => e.PurchaseDate).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.User).WithMany(p => p.CoursePurchases).HasConstraintName("FK_CoursePurchases_AppUsers");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Payments__3214EC07C8A4A329");

            entity.Property(e => e.PaymentDate).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.User).WithMany(p => p.Payments).HasConstraintName("FK_Payments_AppUsers");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
