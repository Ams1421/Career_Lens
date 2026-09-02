using CareerLens.Domain.Common;
using CareerLens.Domain.Enums;

namespace CareerLens.Domain.Entities;

public class ApplicationStatusHistory : BaseEntity
{
    public Guid ApplicationId { get; set; }

    public ApplicationStatus Status { get; set; }

    public string? Notes { get; set; }

    public DateTime ChangedAtUtc { get; set; } = DateTime.UtcNow;

    public Application Application { get; set; } = null!;
}