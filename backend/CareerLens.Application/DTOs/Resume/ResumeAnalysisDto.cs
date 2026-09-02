namespace CareerLens.Application.DTOs.Resume;

public class ResumeAnalysisDto
{
    public int AtsScore { get; set; }

    public int KeywordMatch { get; set; }

    public List<string> MissingSkills { get; set; } = [];

    public List<string> Suggestions { get; set; } = [];

    public Dictionary<string, int> Sections { get; set; } = [];
}