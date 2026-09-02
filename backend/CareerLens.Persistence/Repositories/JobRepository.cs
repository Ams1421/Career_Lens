using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class JobRepository : IJobRepository
{
    private readonly CareerLensDbContext _dbContext;

    public JobRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Job>> GetAllActiveAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Jobs
            .AsNoTracking()
            .Include(job => job.Company)
            .Where(job => job.IsActive)
            .OrderByDescending(job => job.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Job?> GetByIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Jobs
            .Include(job => job.Company)
            .FirstOrDefaultAsync(
                job => job.Id == jobId,
                cancellationToken);
    }

    public async Task<Company?> GetCompanyAsync(
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Companies
            .FirstOrDefaultAsync(
                company =>
                    company.Id == companyId &&
                    company.IsActive,
                cancellationToken);
    }

    public async Task AddAsync(
        Job job,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Jobs.AddAsync(
            job,
            cancellationToken);
    }

    public void Update(Job job)
    {
        _dbContext.Jobs.Update(job);
    }

    public void Delete(Job job)
    {
        _dbContext.Jobs.Remove(job);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}