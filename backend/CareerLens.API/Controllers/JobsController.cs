using CareerLens.Application.DTOs.Jobs;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<JobDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        return Ok(await _jobService.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<JobDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        JobDto? job = await _jobService.GetByIdAsync(id, cancellationToken);

        if (job is null)
            return NotFound(new { message = "Job not found." });

        return Ok(job);
    }

    [HttpPost]
    public async Task<ActionResult<JobDto>> Create(
        [FromBody] CreateJobDto request,
        CancellationToken cancellationToken)
    {
        JobDto? job = await _jobService.CreateAsync(request, cancellationToken);

        if (job is null)
            return BadRequest(new { message = "Company not found." });

        return Ok(job);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<JobDto>> Update(
        Guid id,
        [FromBody] UpdateJobDto request,
        CancellationToken cancellationToken)
    {
        JobDto? job = await _jobService.UpdateAsync(id, request, cancellationToken);

        if (job is null)
            return NotFound(new { message = "Job or Company not found." });

        return Ok(job);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        bool deleted = await _jobService.DeleteAsync(id, cancellationToken);

        if (!deleted)
            return NotFound(new { message = "Job not found." });

        return NoContent();
    }
}