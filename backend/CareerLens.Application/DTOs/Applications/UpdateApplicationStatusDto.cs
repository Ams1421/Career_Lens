using System.ComponentModel.DataAnnotations;

namespace CareerLens.Application.DTOs.Applications;

public class UpdateApplicationStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}