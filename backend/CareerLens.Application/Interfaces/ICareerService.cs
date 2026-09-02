using CareerLens.Application.DTOs.Career;

namespace CareerLens.Application.Interfaces;

public interface ICareerService
{
    Task<List<CareerRecommendationDto>> GetRecommendationsAsync(Guid userId);
}