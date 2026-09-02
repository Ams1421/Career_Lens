using CareerLens.Application.DTOs.Matching;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MatchingController : ControllerBase
{
    private readonly IMatchingService _service;

    public MatchingController(IMatchingService service)
    {
        _service = service;
    }

    [HttpGet("jobs/{jobId:guid}")]
    public async Task<ActionResult<MatchResultDto>> Match(Guid jobId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var result = await _service.MatchJobAsync(jobId, userId);

        if (result is null)
            return NotFound();

        return Ok(result);
    }
}