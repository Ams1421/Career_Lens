using CareerLens.Domain.Entities;
using ApplicationEntity = CareerLens.Domain.Entities.Application;

namespace CareerLens.Application.Interfaces;

public interface IApplicationRepository
{
    Task<Job?> GetJobAsync(Guid jobId, CancellationToken cancellationToken = default);

    Task<CandidateProfile?> GetCandidateProfileAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<ApplicationEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApplicationEntity>> GetByCandidateAsync(Guid candidateProfileId, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid candidateProfileId, Guid jobId, CancellationToken cancellationToken = default);

    Task AddAsync(ApplicationEntity application, CancellationToken cancellationToken = default);

    void Update(ApplicationEntity application);

    void Delete(ApplicationEntity application);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}