using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class Resume : BaseEntity
{
    public Guid CandidateProfileId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string FileUrl { get; set; } = string.Empty;

    public string? FileType { get; set; }

    public long? FileSizeBytes { get; set; }

    public int KeywordMatch { get; set; }

public string? MissingSkills { get; set; }

public string? SectionScores { get; set; }

    public bool IsPrimary { get; set; }

    public int AtsScore { get; set; }

    public string? ExtractedText { get; set; }

    public string? AtsSuggestions { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}