using CareerLens.Domain.Common;
using CareerLens.Domain.Enums;

namespace CareerLens.Domain.Entities;

public class Application : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public Guid JobId { get; set; }

    public Guid? ResumeId { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

    public decimal? MatchScore { get; set; }

    public decimal? EligibilityScore { get; set; }

    public string? CoverLetter { get; set; }

    public DateTime AppliedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? LastStatusChangedAtUtc { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;

    public Job Job { get; set; } = null!;

    public Resume? Resume { get; set; }

    public ICollection<ApplicationStatusHistory> StatusHistory { get; set; } =
        new List<ApplicationStatusHistory>();
}