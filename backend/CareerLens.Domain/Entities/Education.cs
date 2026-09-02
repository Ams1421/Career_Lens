using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Education : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string InstitutionName { get; set; } = string.Empty;

    public string Degree { get; set; } = string.Empty;

    public string? FieldOfStudy { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsCurrentlyStudying { get; set; }

    public decimal? CGPA { get; set; }

    public string? Description { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}