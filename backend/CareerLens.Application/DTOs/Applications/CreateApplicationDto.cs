using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Applications;

public class CreateApplicationDto
{
    [Required]
    public Guid JobId { get; set; }
}