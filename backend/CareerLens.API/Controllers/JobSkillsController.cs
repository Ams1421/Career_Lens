using CareerLens.Application.DTOs.JobSkills;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobSkillsController : ControllerBase
{
    private readonly IJobSkillService _service;

    public JobSkillsController(IJobSkillService service)
    {
        _service = service;
    }

    [HttpGet("{jobId:guid}")]
    public async Task<ActionResult<IReadOnlyList<JobSkillDto>>> Get(Guid jobId)
    {
        return Ok(await _service.GetByJobAsync(jobId));
    }

    [HttpPost]
    public async Task<ActionResult<JobSkillDto>> Create(CreateJobSkillDto request)
    {
        var result = await _service.CreateAsync(request);

        if (result is null)
            return BadRequest(new { message = "Invalid Job/Skill or duplicate skill." });

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<JobSkillDto>> Update(Guid id, UpdateJobSkillDto request)
    {
        var result = await _service.UpdateAsync(id, request);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        return await _service.DeleteAsync(id)
            ? NoContent()
            : NotFound();
    }
}