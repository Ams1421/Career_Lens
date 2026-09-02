namespace CareerLens.Application.DTOs.Jobs;

public class JobDto
{
    public Guid Id { get; set; }

    public Guid CompanyId { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Requirements { get; set; }

    public string? Responsibilities { get; set; }

    public string? Location { get; set; }

    public string? EmploymentType { get; set; }

    public string? WorkMode { get; set; }

    public decimal? MinimumSalary { get; set; }

    public decimal? MaximumSalary { get; set; }

    public string? Currency { get; set; }

    public DateTime? ApplicationDeadlineUtc { get; set; }

    public bool IsActive { get; set; }

    public bool IsVerified { get; set; }
}