using CareerLens.Application.DTOs.Career;
using CareerLens.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareerLens.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CareerController : ControllerBase
{
    private readonly ICareerService _careerService;

    public CareerController(ICareerService careerService)
    {
        _careerService = careerService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (claim == null)
            throw new UnauthorizedAccessException();

        return Guid.Parse(claim);
    }

    // ===========================
    // AI Career Recommendations
    // ===========================
    [HttpGet("recommendations")]
    public async Task<ActionResult<List<CareerRecommendationDto>>> GetRecommendations()
    {
        var result = await _careerService.GetRecommendationsAsync(GetUserId());
        return Ok(result);
    }

    // ===========================
    // Learning Roadmap
    // ===========================
    [HttpGet("roadmap")]
    public async Task<IActionResult> GetRoadmap()
    {
        var recommendations = await _careerService.GetRecommendationsAsync(GetUserId());

        var bestCareer = recommendations.FirstOrDefault();

        if (bestCareer == null)
            return Ok(new { });

        var roadmap = new
        {
            targetCareer = bestCareer.Title,
            matchPercentage = bestCareer.MatchPercentage,

            weeks = new[]
            {
                new
                {
                    week = 1,
                    title = "Foundation",
                    tasks = bestCareer.MissingSkills
                        .Take(2)
                        .Select(s => $"Learn {s}")
                        .ToArray()
                },
                new
                {
                    week = 2,
                    title = "Practice",
                    tasks = new[]
                    {
                        "Build one mini project",
                        "Practice interview questions"
                    }
                },
                new
                {
                    week = 3,
                    title = "Portfolio",
                    tasks = new[]
                    {
                        "Update GitHub",
                        "Improve Resume"
                    }
                },
                new
                {
                    week = 4,
                    title = "Job Ready",
                    tasks = new[]
                    {
                        "Apply to 20 jobs",
                        "Take mock interviews"
                    }
                }
            }
        };

        return Ok(roadmap);
    }

    // ===========================
    // Top AI Ranked Jobs
    // ===========================
    [HttpGet("top-jobs")]
    public async Task<IActionResult> GetTopJobs()
    {
        var recommendations = await _careerService.GetRecommendationsAsync(GetUserId());

        var jobs = recommendations
            .Take(5)
            .Select(r => new
            {
                title = r.Title,
                matchPercentage = r.MatchPercentage,
                strengths = r.Strengths
            });

        return Ok(jobs);
    }
}