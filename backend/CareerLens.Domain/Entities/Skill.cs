using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Category { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();
}