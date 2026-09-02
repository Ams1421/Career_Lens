using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Job : BaseEntity
{
    public Guid CompanyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Requirements { get; set; }

    public string? Responsibilities { get; set; }

    public string? Location { get; set; }

    public string? EmploymentType { get; set; }

    public string? WorkMode { get; set; }

    public decimal? MinimumSalary { get; set; }

    public decimal? MaximumSalary { get; set; }

    public string? Currency { get; set; } = "INR";

    public DateTime? ApplicationDeadlineUtc { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsVerified { get; set; }

    public Company Company { get; set; } = null!;

    public ICollection<JobSkill> JobSkills { get; set; } = new List<JobSkill>();

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}