using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IProjectRepository
{
    Task<IReadOnlyList<Project>> GetByCandidateProfileIdAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task<Project?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Project project,
        CancellationToken cancellationToken = default);

    void Update(Project project);

    void Delete(Project project);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}