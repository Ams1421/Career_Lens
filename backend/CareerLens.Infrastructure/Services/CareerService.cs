using CareerLens.Application.DTOs.Career;
using CareerLens.Application.Interfaces;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Infrastructure.Services;

public class CareerService : ICareerService
{
    private readonly CareerLensDbContext _db;

    public CareerService(CareerLensDbContext db)
    {
        _db = db;
    }

    public async Task<List<CareerRecommendationDto>> GetRecommendationsAsync(Guid userId)
    {
        var profile = await _db.CandidateProfiles
            .Include(p => p.CandidateSkills)
            .ThenInclude(cs => cs.Skill)
            .Include(p => p.Projects)
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return [];

        var resume = await _db.Resumes
            .Where(r => r.CandidateProfileId == profile.Id && r.IsPrimary)
            .FirstOrDefaultAsync();

        var resumeText = (resume?.ExtractedText ?? "").ToLower();

        var userSkills = profile.CandidateSkills
            .Select(s => s.Skill.Name.ToLower())
            .ToHashSet();

        var careers = new List<(string Name, string[] Skills)>
        {
            ("Full Stack Developer", new[]{"react",".net","sql","javascript","docker"}),
            ("Data Analyst", new[]{"sql","excel","power bi","python","tableau"}),
            (".NET Backend Developer", new[]{".net","c#","sql","docker","azure"}),
            ("Frontend Developer", new[]{"react","javascript","html","css","typescript"}),
            ("AI Engineer", new[]{"python","machine learning","tensorflow","pytorch","sql"})
        };

        var results = new List<CareerRecommendationDto>();

        foreach (var career in careers)
        {
            var matched = new List<string>();
            var missing = new List<string>();

            foreach (var skill in career.Skills)
            {
                if (userSkills.Contains(skill) || resumeText.Contains(skill))
                    matched.Add(skill);
                else
                    missing.Add(skill);
            }

            var score = (int)Math.Round(matched.Count * 100.0 / career.Skills.Length);

            // ATS score influences recommendation
            if (resume != null)
                score = (int)Math.Min(100, score * 0.7 + resume.AtsScore * 0.3);

            results.Add(new CareerRecommendationDto
            {
                Title = career.Name,
                MatchPercentage = score,
                Strengths = matched,
                MissingSkills = missing
            });
        }

        return results
            .OrderByDescending(r => r.MatchPercentage)
            .ToList();
    }
}