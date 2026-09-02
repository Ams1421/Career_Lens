using CareerLens.Application.DTOs.Resume;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResumeController : ControllerBase
{
    private readonly IResumeService _resumeService;

    public ResumeController(IResumeService resumeService)
    {
        _resumeService = resumeService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (claim == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(claim);
    }

    [HttpPost("upload")]
    public async Task<ActionResult<ResumeDto>> Upload(
        IFormFile file,
        [FromForm] bool isPrimary = true)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please select a resume.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (extension != ".pdf")
            return BadRequest("Only PDF resumes are allowed.");

        using var stream = file.OpenReadStream();

        var result = await _resumeService.UploadAsync(
            GetUserId(),
            stream,
            file.FileName,
            file.ContentType,
            file.Length,
            isPrimary);

        return Ok(result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<List<ResumeDto>>> GetMyResumes()
    {
        var resumes = await _resumeService.GetMyResumesAsync(GetUserId());
        return Ok(resumes);
    }

    [HttpDelete("{resumeId:guid}")]
    public async Task<IActionResult> Delete(Guid resumeId)
    {
        await _resumeService.DeleteAsync(GetUserId(), resumeId);
        return NoContent();
    }

    [HttpPut("{resumeId:guid}/primary")]
    public async Task<IActionResult> SetPrimary(Guid resumeId)
    {
        await _resumeService.SetPrimaryAsync(GetUserId(), resumeId);

        return Ok(new
        {
            message = "Primary resume updated."
        });
    }

    [HttpPost("recalculate")]
    public async Task<IActionResult> Recalculate()
    {
        await _resumeService.RecalculateAllAsync(GetUserId());

        return Ok(new
        {
            message = "All resumes re-analyzed successfully."
        });
    }

    // AI Resume vs Job Match
    [HttpGet("analyze-job/{jobId:guid}")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> AnalyzeJob(Guid jobId)
    {
        var result = await _resumeService.AnalyzeJobMatchAsync(
            GetUserId(),      // Fixed here
            jobId);

        return Ok(result);
    }
}