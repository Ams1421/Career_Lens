using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.JobSkills;

public class UpdateJobSkillDto
{
    [Required]
    public Guid JobId { get; set; }

    [Required]
    public Guid SkillId { get; set; }

    public bool IsRequired { get; set; }

    [Range(1,5)]
    public int MinimumProficiencyLevel { get; set; }
}