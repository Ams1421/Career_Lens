using CareerLens.Application.DTOs.Matching;
using CareerLens.Application.Interfaces;

namespace CareerLens.Application.Services;

public class MatchingService : IMatchingService
{
    private readonly IMatchingRepository _repository;

    public MatchingService(IMatchingRepository repository)
    {
        _repository = repository;
    }

    public async Task<MatchResultDto?> MatchJobAsync(
        Guid jobId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var job = await _repository.GetJobAsync(jobId, cancellationToken);

        if (job is null)
            return null;

        var profile =
            await _repository.GetCandidateProfileAsync(userId, cancellationToken);

        if (profile is null)
            return null;

        var jobSkills =
            await _repository.GetJobSkillsAsync(jobId, cancellationToken);

        var candidateSkills =
            await _repository.GetCandidateSkillsAsync(profile.Id, cancellationToken);

        MatchResultDto result = new()
        {
            JobId = jobId,
            CandidateId = profile.Id
        };

        // --------------------------------------------------------
        // Fallback: Parse Requirements string if JobSkills is empty
        // --------------------------------------------------------

        if (!jobSkills.Any())
        {
            List<string> requiredSkills =
                (job.Requirements ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToList();

            if (!requiredSkills.Any())
            {
                result.MatchPercentage = 100;
                result.Recommendation = "This job has no required skills.";
                return result;
            }

            List<string> candidateSkillNames =
                candidateSkills
                .Select(s => s.Skill.Name.Trim())
                .ToList();

            foreach (string skill in requiredSkills)
            {
                if (candidateSkillNames.Any(c =>
                    c.Equals(skill, StringComparison.OrdinalIgnoreCase)))
                {
                    result.MatchedSkills.Add(skill);
                }
                else
                {
                    result.MissingSkills.Add(skill);

                    result.SkillGap.Add(new SkillGapDto
                    {
                        Skill = skill,
                        RequiredLevel = 3,
                        CandidateLevel = 0
                    });
                }
            }

            result.MatchPercentage =
                Math.Round(
                    (decimal)result.MatchedSkills.Count /
                    requiredSkills.Count * 100,
                    2);

            result.Recommendation =
                result.MissingSkills.Any()
                    ? $"Learn {string.Join(", ", result.MissingSkills)} to improve your match."
                    : "Excellent match for this job.";

            return result;
        }

        // --------------------------------------------------------
        // Existing logic using JobSkills table
        // --------------------------------------------------------

        int matched = 0;

        foreach (var required in jobSkills)
        {
            var candidate =
                candidateSkills.FirstOrDefault(c =>
                    c.SkillId == required.SkillId);

            if (candidate != null)
            {
                result.MatchedSkills.Add(required.Skill.Name);

                if (candidate.ProficiencyLevel >= required.MinimumProficiencyLevel)
                {
                    matched++;

                    if (candidate.ProficiencyLevel >= 4)
                    {
                        result.StrongSkills.Add(required.Skill.Name);
                    }
                }
                else
                {
                    result.SkillGap.Add(new SkillGapDto
                    {
                        Skill = required.Skill.Name,
                        RequiredLevel = required.MinimumProficiencyLevel,
                        CandidateLevel = candidate.ProficiencyLevel
                    });
                }
            }
            else
            {
                result.MissingSkills.Add(required.Skill.Name);

                result.SkillGap.Add(new SkillGapDto
                {
                    Skill = required.Skill.Name,
                    RequiredLevel = required.MinimumProficiencyLevel,
                    CandidateLevel = 0
                });
            }
        }

        result.MatchPercentage =
            Math.Round((decimal)matched / jobSkills.Count * 100, 2);

        result.Recommendation =
            result.MissingSkills.Any()
                ? $"Learn {string.Join(", ", result.MissingSkills)} to improve your match."
                : "Excellent match for this job.";

        return result;
    }
}