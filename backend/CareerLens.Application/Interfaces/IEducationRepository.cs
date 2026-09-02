using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IEducationRepository
{
    Task<IReadOnlyList<Education>> GetByCandidateProfileIdAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task<Education?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Education education,
        CancellationToken cancellationToken = default);

    void Update(Education education);

    void Delete(Education education);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}