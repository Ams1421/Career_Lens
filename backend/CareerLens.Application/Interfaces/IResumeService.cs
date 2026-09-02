using CareerLens.Application.DTOs.Resume;

namespace CareerLens.Application.Interfaces;

public interface IResumeService
{
    Task<ResumeDto> UploadAsync(
        Guid userId,
        Stream fileStream,
        string originalFileName,
        string contentType,
        long fileSize,
        bool isPrimary);

    Task RecalculateAllAsync(Guid userId);

    Task<List<ResumeDto>> GetMyResumesAsync(Guid userId);

    Task DeleteAsync(Guid userId, Guid resumeId);

    Task SetPrimaryAsync(Guid userId, Guid resumeId);

    Task<JobResumeMatchDto> AnalyzeJobMatchAsync(Guid userId, Guid jobId);
}