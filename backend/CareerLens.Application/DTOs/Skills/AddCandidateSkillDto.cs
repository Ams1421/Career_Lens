using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Skills;

public class AddCandidateSkillDto
{
    [Required]
    public Guid SkillId { get; set; }

    [Range(1, 5)]
    public int ProficiencyLevel { get; set; }

    [Range(0, 100)]
    public decimal? YearsOfExperience { get; set; }
}