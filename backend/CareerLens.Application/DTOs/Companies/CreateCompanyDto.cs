using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Companies;

public class CreateCompanyDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? Description { get; set; }

    [MaxLength(150)]
    public string? Industry { get; set; }

    [MaxLength(500)]
    [Url]
    public string? WebsiteUrl { get; set; }

    [MaxLength(500)]
    [Url]
    public string? LogoUrl { get; set; }

    [MaxLength(250)]
    public string? HeadquartersLocation { get; set; }
}