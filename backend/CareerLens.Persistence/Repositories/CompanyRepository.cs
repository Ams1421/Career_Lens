using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class CompanyRepository : ICompanyRepository
{
    private readonly CareerLensDbContext _dbContext;

    public CompanyRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Company>> GetAllActiveAsync(
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Companies
            .AsNoTracking()
            .Where(company => company.IsActive)
            .OrderBy(company => company.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Company?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Companies
            .FirstOrDefaultAsync(
                company => company.Id == id,
                cancellationToken);
    }

    public async Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default)
    {
        string normalizedName =
            name.Trim().ToLowerInvariant();

        return await _dbContext.Companies
            .AnyAsync(
                company =>
                    company.Name.ToLower() == normalizedName &&
                    (!excludeId.HasValue ||
                     company.Id != excludeId.Value),
                cancellationToken);
    }

    public async Task AddAsync(
        Company company,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Companies.AddAsync(
            company,
            cancellationToken);
    }

    public void Update(Company company)
    {
        _dbContext.Companies.Update(company);
    }

    public void Delete(Company company)
    {
        _dbContext.Companies.Remove(company);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}