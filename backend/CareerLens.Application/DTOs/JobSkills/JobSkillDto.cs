namespace CareerLens.Application.DTOs.JobSkills;

public class JobSkillDto
{
    public Guid Id { get; set; }

    public Guid JobId { get; set; }

    public Guid SkillId { get; set; }

    public string SkillName { get; set; } = string.Empty;

    public string? Category { get; set; }

    public bool IsRequired { get; set; }

    public int MinimumProficiencyLevel { get; set; }
}