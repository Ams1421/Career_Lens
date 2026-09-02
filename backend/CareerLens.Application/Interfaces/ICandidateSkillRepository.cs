using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface ICandidateSkillRepository
{
    Task<IReadOnlyList<CandidateSkill>> GetByCandidateProfileIdAsync(
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task<CandidateSkill?> GetByIdAsync(
        Guid id,
        Guid candidateProfileId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid candidateProfileId,
        Guid skillId,
        CancellationToken cancellationToken = default);

    Task<Skill?> GetActiveSkillAsync(
        Guid skillId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        CandidateSkill candidateSkill,
        CancellationToken cancellationToken = default);

    void Update(CandidateSkill candidateSkill);

    void Delete(CandidateSkill candidateSkill);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}
