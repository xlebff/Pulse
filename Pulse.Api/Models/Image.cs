using System.ComponentModel.DataAnnotations;

namespace Pulse.Api.Models;

public class Image
{
    public int Id { get; set; }

    [Required, StringLength(255)]
    public string Filename { get; set; } = "";

    [Required, StringLength(500)]
    public string Path { get; set; } = "";

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}