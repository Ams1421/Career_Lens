using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface ISkillRepository
{
    Task<IReadOnlyList<Skill>> GetAllActiveAsync(
        CancellationToken cancellationToken = default);

    Task<Skill?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Skill skill,
        CancellationToken cancellationToken = default);

    void Update(Skill skill);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}