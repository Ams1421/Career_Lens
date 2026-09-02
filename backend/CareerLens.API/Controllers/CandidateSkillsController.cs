using System.Security.Claims;
using CareerLens.Application.DTOs.Skills;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CandidateSkillsController : ControllerBase
{
    private readonly ICandidateSkillService _candidateSkillService;

    public CandidateSkillsController(
        ICandidateSkillService candidateSkillService)
    {
        _candidateSkillService = candidateSkillService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CandidateSkillDto>>> GetMySkills(
        CancellationToken cancellationToken)
    {
        Guid? userId = GetAuthenticatedUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid authentication token."
            });
        }

        IReadOnlyList<CandidateSkillDto> skills =
            await _candidateSkillService.GetMySkillsAsync(
                userId.Value,
                cancellationToken);

        return Ok(skills);
    }

    [HttpPost]
    public async Task<ActionResult<CandidateSkillDto>> Add(
        [FromBody] AddCandidateSkillDto request,
        CancellationToken cancellationToken)
    {
        Guid? userId = GetAuthenticatedUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid authentication token."
            });
        }

        CandidateSkillDto? skill =
            await _candidateSkillService.AddAsync(
                userId.Value,
                request,
                cancellationToken);

        if (skill is null)
        {
            return BadRequest(new
            {
                message =
                    "Candidate profile or skill was not found, or the skill is already added."
            });
        }

        return Ok(skill);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CandidateSkillDto>> Update(
        Guid id,
        [FromBody] AddCandidateSkillDto request,
        CancellationToken cancellationToken)
    {
        Guid? userId = GetAuthenticatedUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid authentication token."
            });
        }

        CandidateSkillDto? skill =
            await _candidateSkillService.UpdateAsync(
                userId.Value,
                id,
                request,
                cancellationToken);

        if (skill is null)
        {
            return NotFound(new
            {
                message = "Candidate skill not found."
            });
        }

        return Ok(skill);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        Guid? userId = GetAuthenticatedUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid authentication token."
            });
        }

        bool deleted =
            await _candidateSkillService.DeleteAsync(
                userId.Value,
                id,
                cancellationToken);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Candidate skill not found."
            });
        }

        return NoContent();
    }

    private Guid? GetAuthenticatedUserId()
    {
        string? userIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                userIdValue,
                out Guid userId))
        {
            return null;
        }

        return userId;
    }
}