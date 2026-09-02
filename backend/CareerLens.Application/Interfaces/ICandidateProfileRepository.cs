using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface ICandidateProfileRepository
{
    Task<CandidateProfile?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task UpdateAsync(
        CandidateProfile profile,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}