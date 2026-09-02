using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class LearningRoadmap : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string TargetRole { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int EstimatedDurationWeeks { get; set; }

    public int ProgressPercentage { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAtUtc { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}