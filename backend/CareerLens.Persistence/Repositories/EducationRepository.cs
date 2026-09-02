using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class EducationRepository : IEducationRepository
{
    private readonly CareerLensDbContext _dbContext;

    public EducationRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Education>> GetByCandidateProfileIdAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Educations
            .AsNoTracking()
            .Where(education =>
                education.CandidateProfileId == candidateProfileId)
            .OrderByDescending(education => education.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Education?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Educations
            .FirstOrDefaultAsync(
                education =>
                    education.Id == id &&
                    education.CandidateProfileId == candidateProfileId,
                cancellationToken);
    }

    public async Task AddAsync(
        Education education,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Educations.AddAsync(
            education,
            cancellationToken);
    }

    public void Update(Education education)
    {
        _dbContext.Educations.Update(education);
    }

    public void Delete(Education education)
    {
        _dbContext.Educations.Remove(education);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}