using CareerLens.Application.DTOs.Applications;

namespace CareerLens.Application.Interfaces;

public interface IApplicationService
{
    Task<ApplicationDto?> ApplyAsync(Guid userId, CreateApplicationDto request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ApplicationDto>> GetMyApplicationsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<ApplicationDto?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);

    Task<ApplicationDto?> UpdateStatusAsync(Guid id, UpdateApplicationStatusDto request, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default);
}