using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Api.Data;
using Pulse.Api.Models;
using Pulse.Api.Services;

namespace Pulse.Api.Controllers;

[ApiController]
[Route("api/uploads")]
public class UploadsController(AppDbContext db, FileStorageService files) : ControllerBase
{
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile image, [FromQuery] int userId)
    {
        var user = await db.Users.FindAsync(userId);
        if (user is null) return BadRequest(new { error = "Пользователь не найден" });

        var (ok, error, path, _) = await files.SaveAsync(image);
        if (!ok) return BadRequest(new { error });

        var img = new Image
        {
            Filename = image.FileName,
            Path = path,
            UserId = user.Id
        };

        db.Images.Add(img);
        await db.SaveChangesAsync();

        return StatusCode(201, new { img.Id, img.Path, img.UserId });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? userId)
    {
        var query = db.Images.AsNoTracking().AsQueryable();

        if (userId.HasValue)
            query = query.Where(i => i.UserId == userId.Value);

        var images = await query
            .Include(i => i.User)
            .OrderByDescending(i => i.UploadedAt)
            .Select(i => new
            {
                i.Id,
                i.Filename,
                i.Path,
                i.UploadedAt,
                i.UserId,
                UserName = i.User.Name
            })
            .ToListAsync();

        return Ok(images);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var img = await db.Images.FindAsync(id);
        if (img is null) return NotFound();

        files.Delete(img.Path);
        db.Images.Remove(img);
        await db.SaveChangesAsync();
        return Ok(new { success = true });
    }
}