namespace CareerLens.Application.DTOs.Projects;

public class ProjectDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Technologies { get; set; }

    public string? ProjectUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}