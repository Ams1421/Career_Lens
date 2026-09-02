using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class CareerRecommendation : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string CareerTitle { get; set; } = string.Empty;

    public decimal MatchScore { get; set; }

    public string? Reason { get; set; }

    public string? RecommendedSkills { get; set; }

    public string? RecommendedJobTitles { get; set; }

    public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;

    public CandidateProfile CandidateProfile { get; set; } = null!;
}