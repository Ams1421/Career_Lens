namespace CareerLens.Application.DTOs;

public class UpdateCandidateProfileDto
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }

    public string? Location { get; set; }

    public string? Headline { get; set; }

    public string? Bio { get; set; }

    public string? ProfileImageUrl { get; set; }

    public int? GraduationYear { get; set; }

    public decimal? CGPA { get; set; }

    public string? LinkedInUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public string? PortfolioUrl { get; set; }
}