namespace CareerLens.Application.DTOs.Resume;

public class JobResumeMatchDto
{
    public Guid JobId { get; set; }

    public string JobTitle { get; set; } = "";

    public int MatchPercentage { get; set; }

    public List<string> MatchedSkills { get; set; } = [];

    public List<string> MissingSkills { get; set; } = [];

    public int AtsScore { get; set; }

    public string Recommendation { get; set; } = "";
}