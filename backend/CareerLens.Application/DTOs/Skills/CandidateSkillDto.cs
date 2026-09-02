namespace CareerLens.Application.DTOs.Skills;

public class CandidateSkillDto
{
    public Guid Id { get; set; }

    public Guid SkillId { get; set; }

    public string SkillName { get; set; } = string.Empty;

    public string? Category { get; set; }

    public int ProficiencyLevel { get; set; }

    public decimal? YearsOfExperience { get; set; }
}