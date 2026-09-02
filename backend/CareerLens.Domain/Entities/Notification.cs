using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Notification : BaseEntity
{
    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string? Type { get; set; }

    public string? ActionUrl { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAtUtc { get; set; }

    public DateTime? ExpiresAtUtc { get; set; }

    public User User { get; set; } = null!;
}