using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Jobs;

public class UpdateJobDto
{
    [Required]
    public Guid CompanyId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? Requirements { get; set; }

    [MaxLength(3000)]
    public string? Responsibilities { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(100)]
    public string? EmploymentType { get; set; }

    [MaxLength(100)]
    public string? WorkMode { get; set; }

    public decimal? MinimumSalary { get; set; }

    public decimal? MaximumSalary { get; set; }

    [MaxLength(10)]
    public string? Currency { get; set; }

    public DateTime? ApplicationDeadlineUtc { get; set; }

    public bool IsActive { get; set; }

    public bool IsVerified { get; set; }
}