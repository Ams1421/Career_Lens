using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class JobSkillRepository : IJobSkillRepository
{
    private readonly CareerLensDbContext _dbContext;

    public JobSkillRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<JobSkill>> GetByJobIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobSkills
            .Include(jobSkill => jobSkill.Skill)
            .Where(jobSkill => jobSkill.JobId == jobId)
            .OrderBy(jobSkill => jobSkill.Skill.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<JobSkill?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobSkills
            .Include(jobSkill => jobSkill.Skill)
            .FirstOrDefaultAsync(
                jobSkill => jobSkill.Id == id,
                cancellationToken);
    }

    public async Task<Job?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Jobs
            .FirstOrDefaultAsync(job => job.Id == jobId, cancellationToken);
    }

    public async Task<Skill?> GetSkillAsync(
        Guid skillId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Skills
            .FirstOrDefaultAsync(skill => skill.Id == skillId, cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid jobId,
        Guid skillId,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.JobSkills.AnyAsync(
            jobSkill =>
                jobSkill.JobId == jobId &&
                jobSkill.SkillId == skillId &&
                (!excludeId.HasValue || jobSkill.Id != excludeId.Value),
            cancellationToken);
    }

    public async Task AddAsync(
        JobSkill jobSkill,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.JobSkills.AddAsync(jobSkill, cancellationToken);
    }

    public void Update(JobSkill jobSkill)
    {
        _dbContext.JobSkills.Update(jobSkill);
    }

    public void Delete(JobSkill jobSkill)
    {
        _dbContext.JobSkills.Remove(jobSkill);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}