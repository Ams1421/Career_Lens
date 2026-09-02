using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Skills;

public class UpdateSkillDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Category { get; set; }

    [MaxLength(1000)]
    public string? Description { get; set; }

    public bool IsActive { get; set; }
}