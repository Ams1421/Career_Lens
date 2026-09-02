using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IJobSkillRepository
{
    Task<IReadOnlyList<JobSkill>> GetByJobIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<JobSkill?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<Job?> GetJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<Skill?> GetSkillAsync(
        Guid skillId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid jobId,
        Guid skillId,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        JobSkill jobSkill,
        CancellationToken cancellationToken = default);

    void Update(JobSkill jobSkill);

    void Delete(JobSkill jobSkill);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}