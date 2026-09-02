using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Education;

public class CreateEducationDto
{
    [Required]
    [MaxLength(200)]
    public string InstitutionName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Degree { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? FieldOfStudy { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsCurrentlyStudying { get; set; }

    [Range(0, 10)]
    public decimal? CGPA { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }
}