using CareerLens.Application.DTOs.Jobs;

namespace CareerLens.Application.Interfaces;

public interface IJobService
{
    Task<IReadOnlyList<JobDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<JobDto?> GetByIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<JobDto?> CreateAsync(
        CreateJobDto request,
        CancellationToken cancellationToken = default);

    Task<JobDto?> UpdateAsync(
        Guid jobId,
        UpdateJobDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);
}