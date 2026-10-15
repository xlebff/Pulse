using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Api.Data;
using Pulse.Api.Models;

namespace Pulse.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(AppDbContext db) : ControllerBase
{
    private static readonly string[] AllowedStatuses = { "новый", "подтверждён", "отменён" };

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { error = "Укажите название" });

        if (dto.Months < 1 || dto.Months > 12)
            return BadRequest(new { error = "Срок от 1 до 12 месяцев" });

        if (dto.Total < 0)
            return BadRequest(new { error = "Некорректная сумма" });

        var user = await db.Users.FindAsync(dto.UserId);
        if (user is null) return NotFound(new { error = "Пользователь не найден" });

        var order = new Order
        {
            UserId = user.Id,
            Title = dto.Title.Trim(),
            Months = dto.Months,
            Total = dto.Total,
            Status = "новый"
        };

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return StatusCode(201, new
        {
            order.Id,
            order.Title,
            order.Months,
            order.Total,
            order.Status,
            order.CreatedAt
        });
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMy([FromQuery] int userId)
    {
        var orders = await db.Orders
            .AsNoTracking()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id,
                o.Title,
                o.Months,
                o.Total,
                o.Status,
                o.CreatedAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
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

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOne(int id)
    {
        var order = await db.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return NotFound();

        return Ok(new
        {
            order.Id,
            order.Title,
            order.Months,
            order.Total,
            order.Status,
            order.CreatedAt,
            UserName = order.User.Name,
            UserEmail = order.User.Email
        });
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        if (!AllowedStatuses.Contains(dto.Status))
            return BadRequest(new { error = "Недопустимый статус" });

        var order = await db.Orders.FindAsync(id);
        if (order is null) return NotFound();

        order.Status = dto.Status;
        await db.SaveChangesAsync();
        return Ok(new { success = true });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
    {
        var order = await db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        if (order.UserId != userId) return Forbid();

        db.Orders.Remove(order);
        await db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}

public record CreateOrderDto(int UserId, string Title, int Months, decimal Total);
public record UpdateStatusDto(string Status);