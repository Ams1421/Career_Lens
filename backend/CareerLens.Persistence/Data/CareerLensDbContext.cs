using CareerLens.Domain.Entities;
using CareerLens.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace CareerLens.Persistence.Data;

public class CareerLensDbContext : DbContext
{
    public CareerLensDbContext(
        DbContextOptions<CareerLensDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<CandidateProfile> CandidateProfiles =>
        Set<CandidateProfile>();

    public DbSet<Education> Educations =>
        Set<Education>();

    public DbSet<Skill> Skills =>
        Set<Skill>();

    public DbSet<CandidateSkill> CandidateSkills =>
        Set<CandidateSkill>();

    public DbSet<Project> Projects =>
        Set<Project>();

    public DbSet<Resume> Resumes =>
        Set<Resume>();

    public DbSet<CareerPreference> CareerPreferences =>
        Set<CareerPreference>();

    public DbSet<Company> Companies =>
        Set<Company>();

    public DbSet<Job> Jobs =>
        Set<Job>();

    public DbSet<JobSkill> JobSkills =>
        Set<JobSkill>();

    public DbSet<CareerLens.Domain.Entities.Application> Applications =>
        Set<CareerLens.Domain.Entities.Application>();

    public DbSet<ApplicationStatusHistory> ApplicationStatusHistories =>
        Set<ApplicationStatusHistory>();

    public DbSet<CareerRecommendation> CareerRecommendations =>
        Set<CareerRecommendation>();

    public DbSet<SkillGap> SkillGaps =>
        Set<SkillGap>();

    public DbSet<LearningRoadmap> LearningRoadmaps =>
        Set<LearningRoadmap>();

    public DbSet<Notification> Notifications =>
        Set<Notification>();

    public DbSet<Report> Reports =>
        Set<Report>();

    public DbSet<AuditLog> AuditLogs =>
        Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        CareerLensModelConfiguration.Configure(modelBuilder);
    }
}