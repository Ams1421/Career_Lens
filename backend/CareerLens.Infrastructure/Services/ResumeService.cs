using CareerLens.Application.DTOs.Resume;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Persistence.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using UglyToad.PdfPig;

namespace CareerLens.Infrastructure.Services;

public class ResumeService : IResumeService
{
    private readonly CareerLensDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly AtsAnalyzerService _ats;

    public ResumeService(
        CareerLensDbContext db,
        IWebHostEnvironment env,
        AtsAnalyzerService ats)
    {
        _db = db;
        _env = env;
        _ats = ats;
    }

    public async Task<ResumeDto> UploadAsync(
        Guid userId,
        Stream fileStream,
        string originalFileName,
        string contentType,
        long fileSize,
        bool isPrimary)
    {

        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            throw new Exception("Candidate profile not found.");

        var uploadsFolder = Path.Combine(
            _env.WebRootPath,
            "uploads",
            "resumes");

        Directory.CreateDirectory(uploadsFolder);

        var storedFileName =
            $"{Guid.NewGuid()}{Path.GetExtension(originalFileName)}";

        var fullPath = Path.Combine(uploadsFolder, storedFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        // Extract text from uploaded PDF
        string extractedText = "";

        using (var pdf = PdfDocument.Open(fullPath))
        {
            foreach (var page in pdf.GetPages())
            {
                extractedText += page.Text + Environment.NewLine;
            }
        }

        // Calculate ATS Score
        var result = _ats.Analyze(extractedText);

        // Only one primary resume per candidate
        if (isPrimary)
        {
            var existingPrimary = await _db.Resumes
                .Where(r => r.CandidateProfileId == profile.Id)
                .ToListAsync();

            foreach (var resume in existingPrimary)
            {
                resume.IsPrimary = false;
            }
        }

        var newResume = new Resume
        {
            CandidateProfileId = profile.Id,
            FileName = originalFileName,
            FileUrl = $"/uploads/resumes/{storedFileName}",
            FileType = contentType,
            FileSizeBytes = fileSize,
            IsPrimary = isPrimary,
            CreatedAtUtc = DateTime.UtcNow,

            AtsScore = result.Score,
            KeywordMatch = result.KeywordMatch,
            ExtractedText = extractedText,
            AtsSuggestions = result.Suggestions,
            MissingSkills = result.MissingSkills,
            SectionScores = result.SectionScores
        };

        _db.Resumes.Add(newResume);

        await _db.SaveChangesAsync();

        return new ResumeDto
        {
            Id = newResume.Id,
            FileName = newResume.FileName,
            FileUrl = newResume.FileUrl,
            FileType = newResume.FileType,
            FileSizeBytes = newResume.FileSizeBytes,
            IsPrimary = newResume.IsPrimary,
            CreatedAtUtc = newResume.CreatedAtUtc,

            AtsScore = newResume.AtsScore,
            KeywordMatch = newResume.KeywordMatch,
            AtsSuggestions = newResume.AtsSuggestions,
            MissingSkills = newResume.MissingSkills,
            SectionScores = newResume.SectionScores
        };
    }

    public async Task<List<ResumeDto>> GetMyResumesAsync(Guid userId)
    {
        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            return [];

        return await _db.Resumes
            .Where(r => r.CandidateProfileId == profile.Id)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new ResumeDto
            {
                Id = r.Id,
                FileName = r.FileName,
                FileUrl = r.FileUrl,
                FileType = r.FileType,
                FileSizeBytes = r.FileSizeBytes,
                IsPrimary = r.IsPrimary,
                CreatedAtUtc = r.CreatedAtUtc,
                AtsScore = r.AtsScore,
                KeywordMatch = r.KeywordMatch,
                AtsSuggestions = r.AtsSuggestions,
                MissingSkills = r.MissingSkills,
                SectionScores = r.SectionScores
            })
            .ToListAsync();
    }

    public async Task DeleteAsync(Guid userId, Guid resumeId)
    {
        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            return;

        var resume = await _db.Resumes.FirstOrDefaultAsync(r =>
            r.Id == resumeId &&
            r.CandidateProfileId == profile.Id);

        if (resume == null)
            return;

        var relativePath = resume.FileUrl.TrimStart('/');
        var physicalPath = Path.Combine(_env.WebRootPath, relativePath);

        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }

        _db.Resumes.Remove(resume);

        await _db.SaveChangesAsync();
    }

    public async Task SetPrimaryAsync(Guid userId, Guid resumeId)
    {
        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            return;

        var resumes = await _db.Resumes
            .Where(r => r.CandidateProfileId == profile.Id)
            .ToListAsync();

        if (!resumes.Any(r => r.Id == resumeId))
            return;

        foreach (var resume in resumes)
        {
            resume.IsPrimary = resume.Id == resumeId;
        }

        await _db.SaveChangesAsync();
    }

    public async Task RecalculateAllAsync(Guid userId)
    {
        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            return;

        var resumes = await _db.Resumes
            .Where(r => r.CandidateProfileId == profile.Id)
            .ToListAsync();

        foreach (var resume in resumes)
        {
            var fullPath = Path.Combine(
                _env.WebRootPath,
                resume.FileUrl.TrimStart('/'));

            if (!File.Exists(fullPath))
                continue;

            string text = "";

            using var pdf = PdfDocument.Open(fullPath);

            foreach (var page in pdf.GetPages())
                text += page.Text + Environment.NewLine;

            var result = _ats.Analyze(text);

            resume.ExtractedText = text;
            resume.AtsScore = result.Score;
            resume.KeywordMatch = result.KeywordMatch;
            resume.AtsSuggestions = result.Suggestions;
            resume.MissingSkills = result.MissingSkills;
            resume.SectionScores = result.SectionScores;
        }

        await _db.SaveChangesAsync();
    }

    public async Task<JobResumeMatchDto> AnalyzeJobMatchAsync(Guid userId, Guid jobId)
    {
        var profile = await _db.CandidateProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (profile == null)
            throw new Exception("Candidate profile not found.");

        var resume = await _db.Resumes
            .FirstOrDefaultAsync(r =>
                r.CandidateProfileId == profile.Id &&
                r.IsPrimary);

        if (resume == null)
            throw new Exception("Primary resume not found.");

        var job = await _db.Jobs
            .FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
            throw new Exception("Job not found.");

        var resumeText = (resume.ExtractedText ?? "").ToLower();

        // Load all valid skills from the master Skills table
        var validSkills = await _db.Skills
            .Select(s => s.Name)
            .ToListAsync();

        // Extract only real skills from job Requirements + Description
        var jobSkills = Regex.Split(
                $"{job.Requirements},{job.Description}",
                @"[,/]")
            .Select(x => x.Trim())
            .Where(x =>
                !string.IsNullOrWhiteSpace(x) &&
                validSkills.Any(v =>
                    v.Equals(x, StringComparison.OrdinalIgnoreCase)))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var matched = new List<string>();
        var missing = new List<string>();

        foreach (var skill in jobSkills)
        {
            if (resumeText.Contains(skill.ToLower()))
                matched.Add(skill);
            else
                missing.Add(skill);
        }

        int match = jobSkills.Count == 0
            ? 100
            : (int)Math.Round(matched.Count * 100.0 / jobSkills.Count);

        return new JobResumeMatchDto
        {
            JobId = job.Id,
            JobTitle = job.Title,
            MatchPercentage = match,
            MatchedSkills = matched,
            MissingSkills = missing,
            AtsScore = resume.AtsScore,
            Recommendation = missing.Count == 0
                ? "Excellent match. Your resume already covers the required skills."
                : $"Learn {string.Join(", ", missing.Take(5))} to improve your match."
        };
    }
}