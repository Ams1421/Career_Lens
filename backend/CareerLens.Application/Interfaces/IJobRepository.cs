using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IJobRepository
{
    Task<IReadOnlyList<Job>> GetAllActiveAsync(
        CancellationToken cancellationToken = default);

    Task<Job?> GetByIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default);

    Task<Company?> GetCompanyAsync(
        Guid companyId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Job job,
        CancellationToken cancellationToken = default);

    void Update(Job job);

    void Delete(Job job);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}