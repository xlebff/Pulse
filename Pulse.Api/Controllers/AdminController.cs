using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Api.Data;

namespace Pulse.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController(AppDbContext db) : ControllerBase
{
    private static readonly string[] AllowedStatuses = { "новый", "подтверждён", "отменён" };

    [HttpGet("statuses")]
    public IActionResult GetStatuses() => Ok(new[]
    {
        new { Id = 1, Name = "новый" },
        new { Id = 2, Name = "подтверждён" },
        new { Id = 3, Name = "отменён" }
    });

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await db.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role,
                u.CreatedAt,
                OrdersCount = u.Orders.Count
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        if (user.Role == "admin")
            return BadRequest(new { error = "Нельзя удалить администратора" });

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await db.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.Title,
                o.Months,
                o.Total,
                o.Status,
                o.CreatedAt,
                UserName = o.User.Name,
                UserEmail = o.User.Email
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPatch("orders/{id:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] StatusDto dto)
    {
        if (!AllowedStatuses.Contains(dto.Status))
            return BadRequest(new { error = "Недопустимый статус" });

        var order = await db.Orders.FindAsync(id);
        if (order is null) return NotFound();

        order.Status = dto.Status;
        await db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}

public record StatusDto(string Status);