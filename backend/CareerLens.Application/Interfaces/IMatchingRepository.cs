using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IMatchingRepository
{
    Task<Job?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<JobSkill>> GetJobSkillsAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<CandidateProfile?> GetCandidateProfileAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<CandidateSkill>> GetCandidateSkillsAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);
}