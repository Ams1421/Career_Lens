using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class CareerPreference : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string? PreferredJobTitles { get; set; }

    public string? PreferredLocations { get; set; }

    public string? PreferredEmploymentTypes { get; set; }

    public string? PreferredWorkModes { get; set; }

    public decimal? MinimumExpectedSalary { get; set; }

    public decimal? MaximumExpectedSalary { get; set; }

    public bool WillingToRelocate { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}