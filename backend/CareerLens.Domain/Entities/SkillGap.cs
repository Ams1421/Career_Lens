using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class SkillGap : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public Guid SkillId { get; set; }

    public int RequiredProficiencyLevel { get; set; }

    public int CurrentProficiencyLevel { get; set; }

    public int GapLevel { get; set; }

    public string? TargetRole { get; set; }

    public bool IsResolved { get; set; }

    public DateTime? ResolvedAtUtc { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;

    public Skill Skill { get; set; } = null!;
}