using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface ICompanyRepository
{
    Task<IReadOnlyList<Company>> GetAllActiveAsync(
        CancellationToken cancellationToken = default);

    Task<Company?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsByNameAsync(
        string name,
        Guid? excludeId = null,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Company company,
        CancellationToken cancellationToken = default);

    void Update(Company company);

    void Delete(Company company);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}