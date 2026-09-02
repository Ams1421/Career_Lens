using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Project : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Technologies { get; set; }

    public string? ProjectUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}