using CareerLens.Application.DTOs.Skills;

namespace CareerLens.Application.Interfaces;

public interface ICandidateSkillService
{
    Task<IReadOnlyList<CandidateSkillDto>> GetMySkillsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<CandidateSkillDto?> AddAsync(
        Guid userId,
        AddCandidateSkillDto request,
        CancellationToken cancellationToken = default);

    Task<CandidateSkillDto?> UpdateAsync(
        Guid userId,
        Guid candidateSkillId,
        AddCandidateSkillDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid userId,
        Guid candidateSkillId,
        CancellationToken cancellationToken = default);
}