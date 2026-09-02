using CareerLens.Application.DTOs.Projects;

namespace CareerLens.Application.Interfaces;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<ProjectDto?> CreateAsync(
        Guid userId,
        CreateProjectDto request,
        CancellationToken cancellationToken = default);

    Task<ProjectDto?> UpdateAsync(
        Guid userId,
        Guid projectId,
        UpdateProjectDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default);
}