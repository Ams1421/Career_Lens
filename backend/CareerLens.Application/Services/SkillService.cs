using CareerLens.Application.DTOs.Skills;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class SkillService : ISkillService
{
    private readonly ISkillRepository _repository;

    public SkillService(ISkillRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<SkillDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Skill> skills =
            await _repository.GetAllActiveAsync(
                cancellationToken);

        return skills
            .Select(MapToDto)
            .ToList();
    }

    public async Task<SkillDto?> CreateAsync(
        CreateSkillDto request,
        CancellationToken cancellationToken = default)
    {
        string name = request.Name.Trim();

        bool exists =
            await _repository.ExistsByNameAsync(
                name,
                null,
                cancellationToken);

        if (exists)
        {
            return null;
        }

        Skill skill = new()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Category = request.Category?.Trim(),
            Description = request.Description?.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(
            skill,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(skill);
    }

    public async Task<SkillDto?> UpdateAsync(
        Guid skillId,
        UpdateSkillDto request,
        CancellationToken cancellationToken = default)
    {
        Skill? skill =
            await _repository.GetByIdAsync(
                skillId,
                cancellationToken);

        if (skill is null)
        {
            return null;
        }

        string name = request.Name.Trim();

        bool duplicate =
            await _repository.ExistsByNameAsync(
                name,
                skillId,
                cancellationToken);

        if (duplicate)
        {
            return null;
        }

        skill.Name = name;
        skill.Category = request.Category?.Trim();
        skill.Description = request.Description?.Trim();
        skill.IsActive = request.IsActive;
        skill.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(skill);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(skill);
    }

    private static SkillDto MapToDto(Skill skill)
    {
        return new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name,
            Category = skill.Category,
            Description = skill.Description,
            IsActive = skill.IsActive
        };
    }
}