namespace CareerLens.Application.DTOs;

public class CandidateProfileDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? Location { get; set; }

    public string? Headline { get; set; }

    public string? Bio { get; set; }

    public int ProfileStrength { get; set; }

    public string? ProfileImageUrl { get; set; }

    public int? GraduationYear { get; set; }

    public decimal? CGPA { get; set; }

    public string? LinkedInUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public string? PortfolioUrl { get; set; }
}