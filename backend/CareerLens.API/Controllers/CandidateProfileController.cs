using System.Security.Claims;
using CareerLens.Application.DTOs;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CandidateProfileController : ControllerBase
{
    private readonly ICandidateProfileService _candidateProfileService;
    private readonly IWebHostEnvironment _environment;

    public CandidateProfileController(
    ICandidateProfileService candidateProfileService,
    IWebHostEnvironment environment)
    {
        _candidateProfileService = candidateProfileService;
        _environment = environment;
    }

    [HttpGet("me")]
    public async Task<ActionResult<CandidateProfileDto>> GetMyProfile(
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

        CandidateProfileDto? profile =
            await _candidateProfileService.GetByUserIdAsync(
                userId.Value,
                cancellationToken);

        if (profile is null)
        {
            return NotFound(new
            {
                message = "Candidate profile not found."
            });
        }

        return Ok(profile);
    }

    [HttpPut("me")]
    public async Task<ActionResult<CandidateProfileDto>> UpdateMyProfile(
        [FromBody] UpdateCandidateProfileDto request,
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

        CandidateProfileDto? profile =
            await _candidateProfileService.UpdateAsync(
                userId.Value,
                request,
                cancellationToken);

        if (profile is null)
        {
            return NotFound(new
            {
                message = "Candidate profile not found."
            });
        }

        return Ok(profile);
    }

    [HttpPost("me/image")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadProfileImage(
    IFormFile file,
    CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("Maximum file size is 5 MB.");

        string[] allowed =
        {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

        if (!allowed.Contains(file.ContentType))
            return BadRequest("Only JPG, PNG and WEBP are allowed.");

        Guid? userId = GetAuthenticatedUserId();

        if (userId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid authentication token."
            });
        }

        CandidateProfileDto? profile =
    await _candidateProfileService.GetByUserIdAsync(
        userId.Value,
        cancellationToken);

        if (profile == null)
            return NotFound();

        string webRoot =
    _environment.WebRootPath ??
    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        Directory.CreateDirectory(webRoot);

        string uploads = Path.Combine(webRoot, "uploads", "profiles");

        Directory.CreateDirectory(uploads);

        string extension =
            Path.GetExtension(file.FileName);

        string fileName =
            $"{profile.Id}{extension}";

        string path =
            Path.Combine(uploads, fileName);

        using (var stream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        UpdateCandidateProfileDto updateRequest = new()
        {
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            PhoneNumber = profile.PhoneNumber,
            Location = profile.Location,
            Headline = profile.Headline,
            Bio = profile.Bio,
            ProfileImageUrl = $"/uploads/profiles/{fileName}",
            GraduationYear = profile.GraduationYear,
            CGPA = profile.CGPA,
            LinkedInUrl = profile.LinkedInUrl,
            GitHubUrl = profile.GitHubUrl,
            PortfolioUrl = profile.PortfolioUrl
        };

        await _candidateProfileService.UpdateAsync(
            userId.Value,
            updateRequest,
            cancellationToken);

        return Ok(new
        {
            profileImageUrl =
        $"{Request.Scheme}://{Request.Host}{updateRequest.ProfileImageUrl}"
        });
    }

    private Guid? GetAuthenticatedUserId()
    {
        string? userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out Guid userId))
        {
            return null;
        }

        return userId;
    }
}