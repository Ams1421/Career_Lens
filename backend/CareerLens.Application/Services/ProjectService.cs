using CareerLens.Application.DTOs.Projects;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;
    private readonly ICandidateProfileRepository
        _candidateProfileRepository;

    public ProjectService(
        IProjectRepository repository,
        ICandidateProfileRepository candidateProfileRepository)
    {
        _repository = repository;
        _candidateProfileRepository =
            candidateProfileRepository;
    }

    public async Task<IReadOnlyList<ProjectDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return [];
        }

        IReadOnlyList<Project> projects =
            await _repository.GetByCandidateProfileIdAsync(
                profile.Id,
                cancellationToken);

        return projects
            .Select(MapToDto)
            .ToList();
    }

    public async Task<ProjectDto?> CreateAsync(
        Guid userId,
        CreateProjectDto request,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        Project project = new()
        {
            Id = Guid.NewGuid(),
            CandidateProfileId = profile.Id,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            Technologies = request.Technologies?.Trim(),
            ProjectUrl = request.ProjectUrl?.Trim(),
            GitHubUrl = request.GitHubUrl?.Trim(),
            StartDate = ToUtc(request.StartDate),
            EndDate = ToUtc(request.EndDate),
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(
            project,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(project);
    }

    public async Task<ProjectDto?> UpdateAsync(
        Guid userId,
        Guid projectId,
        UpdateProjectDto request,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        Project? project =
            await _repository.GetByIdAsync(
                projectId,
                profile.Id,
                cancellationToken);

        if (project is null)
        {
            return null;
        }

        project.Title = request.Title.Trim();
        project.Description = request.Description?.Trim();
        project.Technologies = request.Technologies?.Trim();
        project.ProjectUrl = request.ProjectUrl?.Trim();
        project.GitHubUrl = request.GitHubUrl?.Trim();
        project.StartDate = ToUtc(request.StartDate);
        project.EndDate = ToUtc(request.EndDate);
        project.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(project);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(project);
    }

    public async Task<bool> DeleteAsync(
        Guid userId,
        Guid projectId,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return false;
        }

        Project? project =
            await _repository.GetByIdAsync(
                projectId,
                profile.Id,
                cancellationToken);

        if (project is null)
        {
            return false;
        }

        _repository.Delete(project);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return true;
    }

    private static ProjectDto MapToDto(Project project)
    {
        return new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            Technologies = project.Technologies,
            ProjectUrl = project.ProjectUrl,
            GitHubUrl = project.GitHubUrl,
            StartDate = project.StartDate,
            EndDate = project.EndDate
        };
    }

    private static DateTime? ToUtc(DateTime? value)
    {
        if (value is null)
        {
            return null;
        }

        return value.Value.Kind switch
        {
            DateTimeKind.Utc => value.Value,

            DateTimeKind.Local =>
                value.Value.ToUniversalTime(),

            _ => DateTime.SpecifyKind(
                value.Value,
                DateTimeKind.Utc)
        };
    }
}