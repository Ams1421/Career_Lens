using CareerLens.Application.DTOs.Companies;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _repository;

    public CompanyService(ICompanyRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<CompanyDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Company> companies =
            await _repository.GetAllActiveAsync(
                cancellationToken);

        return companies
            .Select(MapToDto)
            .ToList();
    }

    public async Task<CompanyDto?> GetByIdAsync(
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        Company? company =
            await _repository.GetByIdAsync(
                companyId,
                cancellationToken);

        return company is null
            ? null
            : MapToDto(company);
    }

    public async Task<CompanyDto?> CreateAsync(
        CreateCompanyDto request,
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

        Company company = new()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = request.Description?.Trim(),
            Industry = request.Industry?.Trim(),
            WebsiteUrl = request.WebsiteUrl?.Trim(),
            LogoUrl = request.LogoUrl?.Trim(),
            HeadquartersLocation =
                request.HeadquartersLocation?.Trim(),
            IsVerified = false,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(
            company,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(company);
    }

    public async Task<CompanyDto?> UpdateAsync(
        Guid companyId,
        UpdateCompanyDto request,
        CancellationToken cancellationToken = default)
    {
        Company? company =
            await _repository.GetByIdAsync(
                companyId,
                cancellationToken);

        if (company is null)
        {
            return null;
        }

        string name = request.Name.Trim();

        bool duplicate =
            await _repository.ExistsByNameAsync(
                name,
                companyId,
                cancellationToken);

        if (duplicate)
        {
            return null;
        }

        company.Name = name;
        company.Description = request.Description?.Trim();
        company.Industry = request.Industry?.Trim();
        company.WebsiteUrl = request.WebsiteUrl?.Trim();
        company.LogoUrl = request.LogoUrl?.Trim();
        company.HeadquartersLocation =
            request.HeadquartersLocation?.Trim();
        company.IsVerified = request.IsVerified;
        company.IsActive = request.IsActive;
        company.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(company);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(company);
    }

    public async Task<bool> DeleteAsync(
        Guid companyId,
        CancellationToken cancellationToken = default)
    {
        Company? company =
            await _repository.GetByIdAsync(
                companyId,
                cancellationToken);

        if (company is null)
        {
            return false;
        }

        _repository.Delete(company);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return true;
    }

    private static CompanyDto MapToDto(
        Company company)
    {
        return new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            Description = company.Description,
            Industry = company.Industry,
            WebsiteUrl = company.WebsiteUrl,
            LogoUrl = company.LogoUrl,
            HeadquartersLocation =
                company.HeadquartersLocation,
            IsVerified = company.IsVerified,
            IsActive = company.IsActive
        };
    }
}