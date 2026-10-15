using Microsoft.EntityFrameworkCore;
using Pulse.Api.Models;

namespace Pulse.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync(u => u.Role == "admin")) return;

        db.Users.Add(new User
        {
            Name = "Admin",
            Email = "admin@neon.club",
            Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "admin"
        });

        await db.SaveChangesAsync();
    }
}