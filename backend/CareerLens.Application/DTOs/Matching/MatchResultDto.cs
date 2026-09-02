namespace CareerLens.Application.DTOs.Matching;

public class MatchResultDto
{
    public Guid JobId { get; set; }

    public Guid CandidateId { get; set; }

    public decimal MatchPercentage { get; set; }

    public List<string> MatchedSkills { get; set; } = new();

    public List<string> MissingSkills { get; set; } = new();

    public List<string> StrongSkills { get; set; } = new();

    public List<SkillGapDto> SkillGap { get; set; } = new();

    public string Recommendation { get; set; } = string.Empty;
}