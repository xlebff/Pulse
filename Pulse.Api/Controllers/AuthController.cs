using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Api.Data;
using Pulse.Api.Models;

namespace Pulse.Api.Controllers;

[ApiController]
[Route("api")]
public class AuthController(AppDbContext db) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Заполните все поля" });

        if (dto.Password.Length < 6)
            return BadRequest(new { error = "Пароль минимум 6 символов" });

        if (!dto.Email.Contains('@'))
            return BadRequest(new { error = "Некорректный email" });

        var email = dto.Email.Trim().ToLowerInvariant();
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { error = "Email уже используется" });

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "user"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return StatusCode(201, new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Заполните все поля" });

        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
            return Unauthorized(new { error = "Неверный email или пароль" });

        return Ok(new { user.Id, user.Name, user.Email, user.Role, user.CreatedAt });
    }
}

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);