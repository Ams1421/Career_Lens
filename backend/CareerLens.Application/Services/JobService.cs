using CareerLens.Application.DTOs.Jobs;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class JobService : IJobService
{
    private readonly IJobRepository _repository;

    public JobService(IJobRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<JobDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Job> jobs =
            await _repository.GetAllActiveAsync(
                cancellationToken);

        return jobs.Select(MapToDto).ToList();
    }

    public async Task<JobDto?> GetByIdAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        Job? job =
            await _repository.GetByIdAsync(
                jobId,
                cancellationToken);

        return job is null
            ? null
            : MapToDto(job);
    }

    public async Task<JobDto?> CreateAsync(
        CreateJobDto request,
        CancellationToken cancellationToken = default)
    {
        Company? company =
            await _repository.GetCompanyAsync(
                request.CompanyId,
                cancellationToken);

        if (company is null)
        {
            return null;
        }

        Job job = new()
        {
            Id = Guid.NewGuid(),
            CompanyId = request.CompanyId,
            Company = company,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Requirements = request.Requirements?.Trim(),
            Responsibilities = request.Responsibilities?.Trim(),
            Location = request.Location?.Trim(),
            EmploymentType = request.EmploymentType?.Trim(),
            WorkMode = request.WorkMode?.Trim(),
            MinimumSalary = request.MinimumSalary,
            MaximumSalary = request.MaximumSalary,
            Currency = request.Currency?.Trim() ?? "INR",
            ApplicationDeadlineUtc = ToUtc(request.ApplicationDeadlineUtc),
            IsActive = true,
            IsVerified = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(job, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return MapToDto(job);
    }

    public async Task<JobDto?> UpdateAsync(
        Guid jobId,
        UpdateJobDto request,
        CancellationToken cancellationToken = default)
    {
        Job? job =
            await _repository.GetByIdAsync(
                jobId,
                cancellationToken);

        if (job is null)
        {
            return null;
        }

        Company? company =
            await _repository.GetCompanyAsync(
                request.CompanyId,
                cancellationToken);

        if (company is null)
        {
            return null;
        }

        job.CompanyId = request.CompanyId;
        job.Company = company;
        job.Title = request.Title.Trim();
        job.Description = request.Description.Trim();
        job.Requirements = request.Requirements?.Trim();
        job.Responsibilities = request.Responsibilities?.Trim();
        job.Location = request.Location?.Trim();
        job.EmploymentType = request.EmploymentType?.Trim();
        job.WorkMode = request.WorkMode?.Trim();
        job.MinimumSalary = request.MinimumSalary;
        job.MaximumSalary = request.MaximumSalary;
        job.Currency = request.Currency?.Trim() ?? "INR";
        job.ApplicationDeadlineUtc = ToUtc(request.ApplicationDeadlineUtc);
        job.IsActive = request.IsActive;
        job.IsVerified = request.IsVerified;
        job.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(job);
        await _repository.SaveChangesAsync(cancellationToken);

        return MapToDto(job);
    }

    public async Task<bool> DeleteAsync(
        Guid jobId,
        CancellationToken cancellationToken = default)
    {
        Job? job =
            await _repository.GetByIdAsync(
                jobId,
                cancellationToken);

        if (job is null)
        {
            return false;
        }

        _repository.Delete(job);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static JobDto MapToDto(Job job)
    {
        return new JobDto
        {
            Id = job.Id,
            CompanyId = job.CompanyId,
            CompanyName = job.Company.Name,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            Location = job.Location,
            EmploymentType = job.EmploymentType,
            WorkMode = job.WorkMode,
            MinimumSalary = job.MinimumSalary,
            MaximumSalary = job.MaximumSalary,
            Currency = job.Currency,
            ApplicationDeadlineUtc = job.ApplicationDeadlineUtc,
            IsActive = job.IsActive,
            IsVerified = job.IsVerified
        };
    }

    private static DateTime? ToUtc(DateTime? value)
    {
        if (value is null) return null;

        return value.Value.Kind switch
        {
            DateTimeKind.Utc => value.Value,
            DateTimeKind.Local => value.Value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
        };
    }
}