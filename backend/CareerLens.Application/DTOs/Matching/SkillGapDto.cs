namespace CareerLens.Application.DTOs.Matching;

public class SkillGapDto
{
    public string Skill { get; set; } = string.Empty;

    public int RequiredLevel { get; set; }

    public int CandidateLevel { get; set; }
}