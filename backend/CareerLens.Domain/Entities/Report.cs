using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Report : BaseEntity
{
    public Guid ReportedByUserId { get; set; }

    public Guid? JobId { get; set; }

    public Guid? CompanyId { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Status { get; set; } = "Pending";

    public string? ResolutionNotes { get; set; }

    public DateTime? ResolvedAtUtc { get; set; }

    public User ReportedByUser { get; set; } = null!;

    public Job? Job { get; set; }

    public Company? Company { get; set; }
}