using CareerLens.Application.DTOs.Companies;

namespace CareerLens.Application.Interfaces;

public interface ICompanyService
{
    Task<IReadOnlyList<CompanyDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<CompanyDto?> GetByIdAsync(
        Guid companyId,
        CancellationToken cancellationToken = default);

    Task<CompanyDto?> CreateAsync(
        CreateCompanyDto request,
        CancellationToken cancellationToken = default);

    Task<CompanyDto?> UpdateAsync(
        Guid companyId,
        UpdateCompanyDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid companyId,
        CancellationToken cancellationToken = default);
}