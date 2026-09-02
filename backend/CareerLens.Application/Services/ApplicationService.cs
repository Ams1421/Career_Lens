using CareerLens.Application.DTOs.Applications;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Enums;
using ApplicationEntity = CareerLens.Domain.Entities.Application;

namespace CareerLens.Application.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _repository;

    public ApplicationService(IApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApplicationDto?> ApplyAsync(Guid userId, CreateApplicationDto request, CancellationToken cancellationToken = default)
    {
        var profile = await _repository.GetCandidateProfileAsync(userId, cancellationToken);
        var job = await _repository.GetJobAsync(request.JobId, cancellationToken);

        if (profile is null || job is null)
            return null;

        if (await _repository.ExistsAsync(profile.Id, request.JobId, cancellationToken))
            return null;

        var application = new ApplicationEntity
        {
            Id = Guid.NewGuid(),
            CandidateProfileId = profile.Id,
            JobId = request.JobId,
            Status = ApplicationStatus.Applied,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(application, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return new ApplicationDto
        {
            Id = application.Id,
            JobId = job.Id,
            JobTitle = job.Title,
            CompanyName = job.Company.Name,
            Status = application.Status.ToString(),
            AppliedAtUtc = application.CreatedAtUtc
        };
    }

    public async Task<IReadOnlyList<ApplicationDto>> GetMyApplicationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await _repository.GetCandidateProfileAsync(userId, cancellationToken);
        if (profile is null)
            return [];

        return (await _repository.GetByCandidateAsync(profile.Id, cancellationToken))
            .Select(Map).ToList();
    }

    public async Task<ApplicationDto?> GetByIdAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await _repository.GetCandidateProfileAsync(userId, cancellationToken);
        if (profile is null)
            return null;

        var application = await _repository.GetByIdAsync(id, cancellationToken);
        if (application is null || application.CandidateProfileId != profile.Id)
            return null;

        return Map(application);
    }

    public async Task<ApplicationDto?> UpdateStatusAsync(Guid id, UpdateApplicationStatusDto request, CancellationToken cancellationToken = default)
    {
        var application = await _repository.GetByIdAsync(id, cancellationToken);
        if (application is null)
            return null;

        if (!Enum.TryParse<ApplicationStatus>(request.Status, true, out var status))
            return null;

        application.Status = status;
        application.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(application);
        await _repository.SaveChangesAsync(cancellationToken);

        return Map(application);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await _repository.GetCandidateProfileAsync(userId, cancellationToken);
        if (profile is null)
            return false;

        var application = await _repository.GetByIdAsync(id, cancellationToken);
        if (application is null || application.CandidateProfileId != profile.Id)
            return false;

        _repository.Delete(application);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static ApplicationDto Map(ApplicationEntity application)
    {
        return new ApplicationDto
        {
            Id = application.Id,
            JobId = application.JobId,
            JobTitle = application.Job.Title,
            CompanyName = application.Job.Company.Name,
            Status = application.Status.ToString(),
            AppliedAtUtc = application.CreatedAtUtc
        };
    }
}