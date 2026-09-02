using CareerLens.Application.DTOs.Matching;

namespace CareerLens.Application.Interfaces;

public interface IMatchingService
{
    Task<MatchResultDto?> MatchJobAsync(
        Guid jobId,
        Guid userId,
        CancellationToken cancellationToken = default);
}