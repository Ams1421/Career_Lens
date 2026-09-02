using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly CareerLensDbContext _dbContext;

    public ProjectRepository(CareerLensDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Project>>
        GetByCandidateProfileIdAsync(
            Guid candidateProfileId,
            CancellationToken cancellationToken = default)
    {
        return await _dbContext.Projects
            .AsNoTracking()
            .Where(project =>
                project.CandidateProfileId ==
                candidateProfileId)
            .OrderByDescending(project => project.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Projects
            .FirstOrDefaultAsync(
                project =>
                    project.Id == id &&
                    project.CandidateProfileId ==
                    candidateProfileId,
                cancellationToken);
    }

    public async Task AddAsync(
        Project project,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Projects.AddAsync(
            project,
            cancellationToken);
    }

    public void Update(Project project)
    {
        _dbContext.Projects.Update(project);
    }

    public void Delete(Project project)
    {
        _dbContext.Projects.Remove(project);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}