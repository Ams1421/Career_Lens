using CareerLens.Application.DTOs.Skills;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SkillDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        IReadOnlyList<SkillDto> skills =
            await _skillService.GetAllAsync(
                cancellationToken);

        return Ok(skills);
    }

    [HttpPost]
    public async Task<ActionResult<SkillDto>> Create(
        [FromBody] CreateSkillDto request,
        CancellationToken cancellationToken)
    {
        SkillDto? skill =
            await _skillService.CreateAsync(
                request,
                cancellationToken);

        if (skill is null)
        {
            return Conflict(new
            {
                message = "A skill with this name already exists."
            });
        }

        return Ok(skill);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SkillDto>> Update(
        Guid id,
        [FromBody] UpdateSkillDto request,
        CancellationToken cancellationToken)
    {
        SkillDto? skill =
            await _skillService.UpdateAsync(
                id,
                request,
                cancellationToken);

        if (skill is null)
        {
            return NotFound(new
            {
                message =
                    "Skill not found or the skill name already exists."
            });
        }

        return Ok(skill);
    }
}