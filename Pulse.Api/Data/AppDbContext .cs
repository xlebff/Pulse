using Microsoft.EntityFrameworkCore;
using Pulse.Api.Models;
using System.Reflection.Emit;

namespace Pulse.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Image> Images => Set<Image>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasIndex(u => u.Email).IsUnique();
        });

        mb.Entity<Order>(e =>
        {
            e.ToTable("orders");
            e.Property(o => o.Total).HasColumnType("numeric(10,2)");
            e.HasOne(o => o.User)
             .WithMany(u => u.Orders)
             .HasForeignKey(o => o.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(o => o.UserId);
        });

        mb.Entity<Image>(e =>
        {
            e.ToTable("images");
            e.HasOne(i => i.User)
             .WithMany()
             .HasForeignKey(i => i.UserId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(i => i.UserId);
        });
    }
}