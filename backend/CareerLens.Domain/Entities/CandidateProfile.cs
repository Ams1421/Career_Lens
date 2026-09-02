using CareerLens.Domain.Common;

namespace CareerLens.Domain.Entities;

public class CandidateProfile : BaseEntity
{
    public Guid UserId { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Location { get; set; }

    public string? Bio { get; set; }

    public string? Headline { get; set; }

    public string? ProfileImageUrl { get; set; }

    public int? GraduationYear { get; set; }

    public decimal? CGPA { get; set; }

    public string? LinkedInUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public string? PortfolioUrl { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Education> Educations { get; set; } = new List<Education>();

    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

    public ICollection<Project> Projects { get; set; } = new List<Project>();

    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();

    public CareerPreference? CareerPreference { get; set; }

    public ICollection<CareerRecommendation> CareerRecommendations { get; set; } = new List<CareerRecommendation>();
    
    public ICollection<SkillGap> SkillGaps { get; set; } = new List<SkillGap>();
    
    public ICollection<LearningRoadmap> LearningRoadmaps { get; set; } = new List<LearningRoadmap>();
}