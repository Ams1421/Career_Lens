namespace CareerLens.Application.DTOs.Career;

public class CareerRecommendationDto
{
    public string Title { get; set; } = string.Empty;
    public int MatchPercentage { get; set; }
    public List<string> Strengths { get; set; } = [];
    public List<string> MissingSkills { get; set; } = [];
}