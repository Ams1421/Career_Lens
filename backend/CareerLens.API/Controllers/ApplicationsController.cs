using CareerLens.Application.DTOs.Applications;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _service;

    public ApplicationsController(IApplicationService service)
    {
        _service = service;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<ActionResult<ApplicationDto>> Apply(CreateApplicationDto request)
    {
        var result = await _service.ApplyAsync(GetUserId(), request);

        if (result is null)
            return BadRequest(new { message = "Unable to apply." });

        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<IReadOnlyList<ApplicationDto>>> MyApplications()
    {
        return Ok(await _service.GetMyApplicationsAsync(GetUserId()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApplicationDto>> Get(Guid id)
    {
        var result = await _service.GetByIdAsync(id, GetUserId());

        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult<ApplicationDto>> UpdateStatus(Guid id, UpdateApplicationStatusDto request)
    {
        var result = await _service.UpdateStatusAsync(id, request);

        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return await _service.DeleteAsync(id, GetUserId())
            ? NoContent()
            : NotFound();
    }
}