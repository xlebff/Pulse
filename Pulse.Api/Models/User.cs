using System.ComponentModel.DataAnnotations;

namespace Pulse.Api.Models;

public class User
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string Name { get; set; } = "";

    [Required, StringLength(255)]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";

    [Required, StringLength(20)]
    public string Role { get; set; } = "user";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Order> Orders { get; set; } = [];
}