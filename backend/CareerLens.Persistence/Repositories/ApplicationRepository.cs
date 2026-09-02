using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using ApplicationEntity = CareerLens.Domain.Entities.Application;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class ApplicationRepository : IApplicationRepository
{
    private readonly CareerLensDbContext _dbContext;

    public ApplicationRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Job?> GetJobAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Jobs
            .Include(job => job.Company)
            .FirstOrDefaultAsync(job => job.Id == jobId, cancellationToken);
    }

    public async Task<CandidateProfile?> GetCandidateProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.CandidateProfiles
            .FirstOrDefaultAsync(profile => profile.UserId == userId, cancellationToken);
    }

    public async Task<ApplicationEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications
            .Include(application => application.Job)
                .ThenInclude(job => job.Company)
            .FirstOrDefaultAsync(application => application.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<ApplicationEntity>> GetByCandidateAsync(Guid candidateProfileId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications
            .Include(application => application.Job)
                .ThenInclude(job => job.Company)
            .Where(application => application.CandidateProfileId == candidateProfileId)
            .OrderByDescending(application => application.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid candidateProfileId, Guid jobId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications.AnyAsync(
            application => application.CandidateProfileId == candidateProfileId &&
                           application.JobId == jobId,
            cancellationToken);
    }

    public async Task AddAsync(ApplicationEntity application, CancellationToken cancellationToken = default)
    {
        await _dbContext.Applications.AddAsync(application, cancellationToken);
    }

    public void Update(ApplicationEntity application)
    {
        _dbContext.Applications.Update(application);
    }

    public void Delete(ApplicationEntity application)
    {
        _dbContext.Applications.Remove(application);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}