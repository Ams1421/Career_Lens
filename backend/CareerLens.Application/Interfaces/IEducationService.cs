using CareerLens.Application.DTOs.Education;

namespace CareerLens.Application.Interfaces;

public interface IEducationService
{
    Task<IReadOnlyList<EducationDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<EducationDto?> CreateAsync(
        Guid userId,
        CreateEducationDto request,
        CancellationToken cancellationToken = default);

    Task<EducationDto?> UpdateAsync(
        Guid userId,
        Guid educationId,
        UpdateEducationDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid userId,
        Guid educationId,
        CancellationToken cancellationToken = default);
}