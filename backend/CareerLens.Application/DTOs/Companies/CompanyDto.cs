namespace CareerLens.Application.DTOs.Companies;

public class CompanyDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Industry { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? LogoUrl { get; set; }

    public string? HeadquartersLocation { get; set; }

    public bool IsVerified { get; set; }

    public bool IsActive { get; set; }
}