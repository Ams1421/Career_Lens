using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class CandidateSkill : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public Guid SkillId { get; set; }

    public int ProficiencyLevel { get; set; }

    public decimal? YearsOfExperience { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;

    public Skill Skill { get; set; } = null!;
}