namespace CareerLens.Application.DTOs.Resume;

public class ResumeDto
{

    public Guid Id { get; set; }

    public string FileName { get; set; } = "";

    public string FileUrl { get; set; } = "";

    public string? FileType { get; set; }

    public long? FileSizeBytes { get; set; }

    public bool IsPrimary { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public int AtsScore { get; set; }

    public int KeywordMatch { get; set; }

    public string? AtsSuggestions { get; set; }

    public string? MissingSkills { get; set; }

    public string? SectionScores { get; set; }
    
}