using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Projects;

public class CreateProjectDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string? Description { get; set; }

    [MaxLength(1000)]
    public string? Technologies { get; set; }

    [MaxLength(500)]
    [Url]
    public string? ProjectUrl { get; set; }

    [MaxLength(500)]
    [Url]
    public string? GitHubUrl { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}