using System.Security.Claims;
using CareerLens.Application.DTOs.Education;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EducationController : ControllerBase
{
    private readonly IEducationService _educationService;

    public EducationController(
        IEducationService educationService)
    {
        _educationService = educationService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EducationDto>>> GetAll(
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

        IReadOnlyList<EducationDto> education =
            await _educationService.GetAllAsync(
                userId.Value,
                cancellationToken);

        return Ok(education);
    }

    [HttpPost]
    public async Task<ActionResult<EducationDto>> Create(
        [FromBody] CreateEducationDto request,
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

        EducationDto? education =
            await _educationService.CreateAsync(
                userId.Value,
                request,
                cancellationToken);

        if (education is null)
        {
            return NotFound(new
            {
                message = "Candidate profile not found."
            });
        }

        return CreatedAtAction(
            nameof(GetAll),
            education);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<EducationDto>> Update(
        Guid id,
        [FromBody] UpdateEducationDto request,
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

        EducationDto? education =
            await _educationService.UpdateAsync(
                userId.Value,
                id,
                request,
                cancellationToken);

        if (education is null)
        {
            return NotFound(new
            {
                message = "Education record not found."
            });
        }

        return Ok(education);
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
            await _educationService.DeleteAsync(
                userId.Value,
                id,
                cancellationToken);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Education record not found."
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