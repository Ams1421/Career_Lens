namespace CareerLens.Application.DTOs.Applications;

public class ApplicationDto
{
    public Guid Id { get; set; }

    public Guid JobId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string CompanyName { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime AppliedAtUtc { get; set; }
}