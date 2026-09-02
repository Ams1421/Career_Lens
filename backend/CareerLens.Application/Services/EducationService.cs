using CareerLens.Application.DTOs.Education;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class EducationService : IEducationService
{
    private readonly IEducationRepository _repository;
    private readonly ICandidateProfileRepository _candidateProfileRepository;

    public EducationService(
        IEducationRepository repository,
        ICandidateProfileRepository candidateProfileRepository)
    {
        _repository = repository;
        _candidateProfileRepository = candidateProfileRepository;
    }

    public async Task<IReadOnlyList<EducationDto>> GetAllAsync(
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

        IReadOnlyList<Education> educationRecords =
            await _repository.GetByCandidateProfileIdAsync(
                profile.Id,
                cancellationToken);

        return educationRecords
            .Select(MapToDto)
            .ToList();
    }

    public async Task<EducationDto?> CreateAsync(
        Guid userId,
        CreateEducationDto request,
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

        Education education = new()
        {
            Id = Guid.NewGuid(),
            CandidateProfileId = profile.Id,
            InstitutionName = request.InstitutionName.Trim(),
            Degree = request.Degree.Trim(),
            FieldOfStudy = request.FieldOfStudy?.Trim(),
            StartDate = ToUtc(request.StartDate),
            EndDate = request.IsCurrentlyStudying
            ? null
            : ToUtc(request.EndDate),
            IsCurrentlyStudying = request.IsCurrentlyStudying,
            CGPA = request.CGPA,
            Description = request.Description?.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(
            education,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(education);
    }

    public async Task<EducationDto?> UpdateAsync(
        Guid userId,
        Guid educationId,
        UpdateEducationDto request,
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

        Education? education =
            await _repository.GetByIdAsync(
                educationId,
                profile.Id,
                cancellationToken);

        if (education is null)
        {
            return null;
        }

        education.InstitutionName = request.InstitutionName.Trim();
        education.Degree = request.Degree.Trim();
        education.FieldOfStudy = request.FieldOfStudy?.Trim();
        education.StartDate = ToUtc(request.StartDate);
        education.EndDate = request.IsCurrentlyStudying
            ? null
            : ToUtc(request.EndDate);
        education.IsCurrentlyStudying =
            request.IsCurrentlyStudying;
        education.CGPA = request.CGPA;
        education.Description = request.Description?.Trim();
        education.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(education);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(education);
    }

    public async Task<bool> DeleteAsync(
        Guid userId,
        Guid educationId,
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

        Education? education =
            await _repository.GetByIdAsync(
                educationId,
                profile.Id,
                cancellationToken);

        if (education is null)
        {
            return false;
        }

        _repository.Delete(education);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return true;
    }

    private static EducationDto MapToDto(
        Education education)
    {
        return new EducationDto
        {
            Id = education.Id,
            InstitutionName = education.InstitutionName,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            IsCurrentlyStudying =
                education.IsCurrentlyStudying,
            CGPA = education.CGPA,
            Description = education.Description
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
            DateTimeKind.Local => value.Value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(
                value.Value,
                DateTimeKind.Utc)
        };
    }
}