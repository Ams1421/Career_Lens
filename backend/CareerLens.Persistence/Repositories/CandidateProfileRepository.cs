using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class CandidateProfileRepository : ICandidateProfileRepository
{
    private readonly CareerLensDbContext _dbContext;

    public CandidateProfileRepository(
        CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CandidateProfile?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateProfiles
            .Include(profile => profile.User)
            .FirstOrDefaultAsync(
                profile => profile.UserId == userId,
                cancellationToken);
    }

    public Task UpdateAsync(
        CandidateProfile profile,
        CancellationToken cancellationToken = default)
    {
        _dbContext.CandidateProfiles.Update(profile);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}