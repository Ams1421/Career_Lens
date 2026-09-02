using System.Security.Claims;
using CareerLens.Application.DTOs.Projects;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(
        IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectDto>>> GetAll(
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

        IReadOnlyList<ProjectDto> projects =
            await _projectService.GetAllAsync(
                userId.Value,
                cancellationToken);

        return Ok(projects);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create(
        [FromBody] CreateProjectDto request,
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

        ProjectDto? project =
            await _projectService.CreateAsync(
                userId.Value,
                request,
                cancellationToken);

        if (project is null)
        {
            return NotFound(new
            {
                message = "Candidate profile not found."
            });
        }

        return Ok(project);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProjectDto>> Update(
        Guid id,
        [FromBody] UpdateProjectDto request,
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

        ProjectDto? project =
            await _projectService.UpdateAsync(
                userId.Value,
                id,
                request,
                cancellationToken);

        if (project is null)
        {
            return NotFound(new
            {
                message = "Project not found."
            });
        }

        return Ok(project);
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
            await _projectService.DeleteAsync(
                userId.Value,
                id,
                cancellationToken);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Project not found."
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