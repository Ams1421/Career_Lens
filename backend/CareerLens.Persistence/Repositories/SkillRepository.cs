using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class SkillRepository : ISkillRepository
{
    private readonly CareerLensDbContext _dbContext;

    public SkillRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Skill>> GetAllActiveAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Skills
            .AsNoTracking()
            .Where(skill => skill.IsActive)
            .OrderBy(skill => skill.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Skill?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Skills
            .FirstOrDefaultAsync(
                skill => skill.Id == id,
                cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        string normalizedName =
            name.Trim().ToLowerInvariant();

        return await _dbContext.Skills
            .AnyAsync(
                skill =>
                    skill.Name.ToLower() == normalizedName &&
                    (!excludeId.HasValue ||
                     skill.Id != excludeId.Value),
                cancellationToken);
    }

    public async Task AddAsync(
        Skill skill,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Skills.AddAsync(
            skill,
            cancellationToken);
    }

    public void Update(Skill skill)
    {
        _dbContext.Skills.Update(skill);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}