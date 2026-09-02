using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class JobSkill : BaseEntity
{
    public Guid JobId { get; set; }

    public Guid SkillId { get; set; }

    public bool IsRequired { get; set; }

    public int MinimumProficiencyLevel { get; set; }

    public Job Job { get; set; } = null!;

    public Skill Skill { get; set; } = null!;
}