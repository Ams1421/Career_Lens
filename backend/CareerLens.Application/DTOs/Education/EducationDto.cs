namespace CareerLens.Application.DTOs.Education;

public class EducationDto
{
    public Guid Id { get; set; }

    public string InstitutionName { get; set; } = string.Empty;

    public string Degree { get; set; } = string.Empty;

    public string? FieldOfStudy { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsCurrentlyStudying { get; set; }

    public decimal? CGPA { get; set; }

    public string? Description { get; set; }
}