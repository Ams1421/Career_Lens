using CareerLens.Application.DTOs.JobSkills;

namespace CareerLens.Application.Interfaces;

public interface IJobSkillService
{
    Task<IReadOnlyList<JobSkillDto>> GetByJobAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<JobSkillDto?> CreateAsync(
        CreateJobSkillDto request,
        CancellationToken cancellationToken = default);

    Task<JobSkillDto?> UpdateAsync(
        Guid id,
        UpdateJobSkillDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}