using CareerLens.Application.DTOs;

namespace CareerLens.Application.Interfaces;

public interface ICandidateProfileService
{
    Task<CandidateProfileDto?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<CandidateProfileDto?> UpdateAsync(
        Guid userId,
        UpdateCandidateProfileDto request,
        CancellationToken cancellationToken = default);
}