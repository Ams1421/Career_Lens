using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class MatchingRepository : IMatchingRepository
{
    private readonly CareerLensDbContext _dbContext;

    public MatchingRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Job?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Jobs
            .Include(job => job.Company)
            .FirstOrDefaultAsync(job => job.Id == jobId, cancellationToken);
    }

    public async Task<IReadOnlyList<JobSkill>> GetJobSkillsAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobSkills
            .Include(jobSkill => jobSkill.Skill)
            .Where(jobSkill => jobSkill.JobId == jobId)
            .ToListAsync(cancellationToken);
    }

    public async Task<CandidateProfile?> GetCandidateProfileAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateProfiles
            .FirstOrDefaultAsync(
                profile => profile.UserId == userId,
                cancellationToken);
    }

    public async Task<IReadOnlyList<CandidateSkill>> GetCandidateSkillsAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateSkills
            .Include(candidateSkill => candidateSkill.Skill)
            .Where(candidateSkill => candidateSkill.CandidateProfileId == candidateProfileId)
            .ToListAsync(cancellationToken);
    }
}