using System.ComponentModel.DataAnnotations;

namespace Pulse.Api.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required, StringLength(100)]
    public string Title { get; set; } = "";

    public int Months { get; set; } = 1;

    public decimal Total { get; set; }

    [Required, StringLength(50)]
    public string Status { get; set; } = "новый";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}