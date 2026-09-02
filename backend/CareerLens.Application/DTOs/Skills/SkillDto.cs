namespace CareerLens.Application.DTOs.Skills;

public class SkillDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Category { get; set; }

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}