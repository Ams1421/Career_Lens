using CareerLens.Application.DTOs.Skills;

namespace CareerLens.Application.Interfaces;

public interface ISkillService
{
    Task<IReadOnlyList<SkillDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<SkillDto?> CreateAsync(
        CreateSkillDto request,
        CancellationToken cancellationToken = default);

    Task<SkillDto?> UpdateAsync(
        Guid skillId,
        UpdateSkillDto request,
        CancellationToken cancellationToken = default);
}