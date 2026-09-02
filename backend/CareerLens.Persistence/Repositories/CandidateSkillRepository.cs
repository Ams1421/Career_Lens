using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class CandidateSkillRepository : ICandidateSkillRepository
{
    private readonly CareerLensDbContext _dbContext;

    public CandidateSkillRepository(
        CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<CandidateSkill>>
        GetByCandidateProfileIdAsync(
            Guid candidateProfileId,
            CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateSkills
            .AsNoTracking()
            .Include(candidateSkill => candidateSkill.Skill)
            .Where(candidateSkill =>
                candidateSkill.CandidateProfileId ==
                candidateProfileId &&
                candidateSkill.Skill.IsActive)
            .OrderBy(candidateSkill => candidateSkill.Skill.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<CandidateSkill?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateSkills
            .Include(candidateSkill => candidateSkill.Skill)
            .FirstOrDefaultAsync(
                candidateSkill =>
                    candidateSkill.Id == id &&
                    candidateSkill.CandidateProfileId ==
                    candidateProfileId,
                cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid candidateProfileId,
        Guid skillId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateSkills
            .AnyAsync(
                candidateSkill =>
                    candidateSkill.CandidateProfileId ==
                    candidateProfileId &&
                    candidateSkill.SkillId == skillId,
                cancellationToken);
    }

    public async Task<Skill?> GetActiveSkillAsync(
        Guid skillId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Skills
            .FirstOrDefaultAsync(
                skill =>
                    skill.Id == skillId &&
                    skill.IsActive,
                cancellationToken);
    }

    public async Task AddAsync(
        CandidateSkill candidateSkill,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.CandidateSkills.AddAsync(
            candidateSkill,
            cancellationToken);
    }

    public void Update(CandidateSkill candidateSkill)
    {
        _dbContext.CandidateSkills.Update(candidateSkill);
    }

    public void Delete(CandidateSkill candidateSkill)
    {
        _dbContext.CandidateSkills.Remove(candidateSkill);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}