using CareerLens.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using JobApplication = CareerLens.Domain.Entities.Application;

namespace CareerLens.Persistence.Configurations;

public static class CareerLensModelConfiguration
{
    public static void Configure(ModelBuilder modelBuilder)
    {
        ConfigureUser(modelBuilder);
        ConfigureCandidateProfile(modelBuilder);
        ConfigureEducation(modelBuilder);
        ConfigureSkill(modelBuilder);
        ConfigureCandidateSkill(modelBuilder);
        ConfigureProject(modelBuilder);
        ConfigureResume(modelBuilder);
        ConfigureCareerPreference(modelBuilder);

        ConfigureCompany(modelBuilder);
        ConfigureJob(modelBuilder);
        ConfigureJobSkill(modelBuilder);

        ConfigureApplication(modelBuilder);
        ConfigureApplicationStatusHistory(modelBuilder);

        ConfigureCareerRecommendation(modelBuilder);
        ConfigureSkillGap(modelBuilder);
        ConfigureLearningRoadmap(modelBuilder);

        ConfigureNotification(modelBuilder);
        ConfigureReport(modelBuilder);
        ConfigureAuditLog(modelBuilder);
    }

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<User> builder = modelBuilder.Entity<User>();

        builder.ToTable("Users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(user => user.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(user => user.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(user => user.Email)
            .IsUnique();

        builder.Property(user => user.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(user => user.IsActive)
            .IsRequired();

        builder.Property(user => user.Role)
            .IsRequired();

        builder.Property(user => user.CreatedAtUtc)
            .IsRequired();

        builder.HasOne(user => user.CandidateProfile)
            .WithOne(profile => profile.User)
            .HasForeignKey<CandidateProfile>(profile => profile.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureCandidateProfile(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<CandidateProfile> builder =
            modelBuilder.Entity<CandidateProfile>();

        builder.ToTable("CandidateProfiles");

        builder.HasKey(profile => profile.Id);

        builder.Property(profile => profile.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(profile => profile.Location)
            .HasMaxLength(200);

        builder.Property(profile => profile.Bio)
            .HasMaxLength(2000);

        builder.Property(profile => profile.Headline)
            .HasMaxLength(200);

        builder.Property(profile => profile.ProfileImageUrl)
            .HasMaxLength(1000);

        builder.Property(profile => profile.CGPA)
            .HasPrecision(4, 2);

        builder.Property(profile => profile.LinkedInUrl)
            .HasMaxLength(500);

        builder.Property(profile => profile.GitHubUrl)
            .HasMaxLength(500);

        builder.Property(profile => profile.PortfolioUrl)
            .HasMaxLength(500);

        builder.HasIndex(profile => profile.UserId)
            .IsUnique();

        builder.HasMany(profile => profile.Educations)
            .WithOne(education => education.CandidateProfile)
            .HasForeignKey(education => education.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.CandidateSkills)
            .WithOne(candidateSkill => candidateSkill.CandidateProfile)
            .HasForeignKey(candidateSkill => candidateSkill.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.Projects)
            .WithOne(project => project.CandidateProfile)
            .HasForeignKey(project => project.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.Resumes)
            .WithOne(resume => resume.CandidateProfile)
            .HasForeignKey(resume => resume.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(profile => profile.CareerPreference)
            .WithOne(preference => preference.CandidateProfile)
            .HasForeignKey<CareerPreference>(
                preference => preference.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.CareerRecommendations)
            .WithOne(recommendation => recommendation.CandidateProfile)
            .HasForeignKey(recommendation => recommendation.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.SkillGaps)
            .WithOne(skillGap => skillGap.CandidateProfile)
            .HasForeignKey(skillGap => skillGap.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(profile => profile.LearningRoadmaps)
            .WithOne(roadmap => roadmap.CandidateProfile)
            .HasForeignKey(roadmap => roadmap.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(profile => profile.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureEducation(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Education> builder =
            modelBuilder.Entity<Education>();

        builder.ToTable("Educations");

        builder.HasKey(education => education.Id);

        builder.Property(education => education.InstitutionName)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(education => education.Degree)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(education => education.FieldOfStudy)
            .HasMaxLength(200);

        builder.Property(education => education.CGPA)
            .HasPrecision(4, 2);

        builder.Property(education => education.Description)
            .HasMaxLength(2000);

        builder.HasIndex(education => education.CandidateProfileId);

        builder.Property(education => education.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureSkill(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Skill> builder =
            modelBuilder.Entity<Skill>();

        builder.ToTable("Skills");

        builder.HasKey(skill => skill.Id);

        builder.Property(skill => skill.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(skill => skill.Category)
            .HasMaxLength(100);

        builder.Property(skill => skill.Description)
            .HasMaxLength(1000);

        builder.Property(skill => skill.IsActive)
            .IsRequired();

        builder.HasIndex(skill => skill.Name)
            .IsUnique();

        builder.Property(skill => skill.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureCandidateSkill(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<CandidateSkill> builder =
            modelBuilder.Entity<CandidateSkill>();

        builder.ToTable("CandidateSkills");

        builder.HasKey(candidateSkill => candidateSkill.Id);

        builder.Property(candidateSkill => candidateSkill.ProficiencyLevel)
            .IsRequired();

        builder.Property(candidateSkill => candidateSkill.YearsOfExperience)
            .HasPrecision(5, 2);

        builder.HasIndex(candidateSkill =>
                new
                {
                    candidateSkill.CandidateProfileId,
                    candidateSkill.SkillId
                })
            .IsUnique();

        builder.HasOne(candidateSkill => candidateSkill.Skill)
            .WithMany(skill => skill.CandidateSkills)
            .HasForeignKey(candidateSkill => candidateSkill.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(candidateSkill => candidateSkill.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureProject(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Project> builder =
            modelBuilder.Entity<Project>();

        builder.ToTable("Projects");

        builder.HasKey(project => project.Id);

        builder.Property(project => project.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(project => project.Description)
            .HasMaxLength(3000);

        builder.Property(project => project.Technologies)
            .HasMaxLength(1000);

        builder.Property(project => project.ProjectUrl)
            .HasMaxLength(500);

        builder.Property(project => project.GitHubUrl)
            .HasMaxLength(500);

        builder.HasIndex(project => project.CandidateProfileId);

        builder.Property(project => project.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureResume(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Resume> builder =
            modelBuilder.Entity<Resume>();

        builder.ToTable("Resumes");

        builder.HasKey(resume => resume.Id);

        builder.Property(resume => resume.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(resume => resume.FileUrl)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(resume => resume.FileType)
            .HasMaxLength(100);

        builder.Property(resume => resume.FileSizeBytes);

        builder.Property(resume => resume.IsPrimary)
            .IsRequired();

        builder.HasIndex(resume => resume.CandidateProfileId);

        builder.Property(resume => resume.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureCareerPreference(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<CareerPreference> builder =
            modelBuilder.Entity<CareerPreference>();

        builder.ToTable("CareerPreferences");

        builder.HasKey(preference => preference.Id);

        builder.Property(preference => preference.PreferredJobTitles)
            .HasMaxLength(1000);

        builder.Property(preference => preference.PreferredLocations)
            .HasMaxLength(1000);

        builder.Property(preference => preference.PreferredEmploymentTypes)
            .HasMaxLength(500);

        builder.Property(preference => preference.PreferredWorkModes)
            .HasMaxLength(500);

        builder.Property(preference => preference.MinimumExpectedSalary)
            .HasPrecision(12, 2);

        builder.Property(preference => preference.MaximumExpectedSalary)
            .HasPrecision(12, 2);

        builder.Property(preference => preference.WillingToRelocate)
            .IsRequired();

        builder.HasIndex(preference => preference.CandidateProfileId)
            .IsUnique();

        builder.Property(preference => preference.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureCompany(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Company> builder =
            modelBuilder.Entity<Company>();

        builder.ToTable("Companies");

        builder.HasKey(company => company.Id);

        builder.Property(company => company.Name)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(company => company.Description)
            .HasMaxLength(3000);

        builder.Property(company => company.Industry)
            .HasMaxLength(150);

        builder.Property(company => company.WebsiteUrl)
            .HasMaxLength(500);

        builder.Property(company => company.LogoUrl)
            .HasMaxLength(1000);

        builder.Property(company => company.HeadquartersLocation)
            .HasMaxLength(250);

        builder.Property(company => company.IsVerified)
            .IsRequired();

        builder.Property(company => company.IsActive)
            .IsRequired();

        builder.HasIndex(company => company.Name);

        builder.Property(company => company.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureJob(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Job> builder =
            modelBuilder.Entity<Job>();

        builder.ToTable("Jobs");

        builder.HasKey(job => job.Id);

        builder.Property(job => job.Title)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(job => job.Description)
            .IsRequired()
            .HasMaxLength(10000);

        builder.Property(job => job.Requirements)
            .HasMaxLength(10000);

        builder.Property(job => job.Responsibilities)
            .HasMaxLength(10000);

        builder.Property(job => job.Location)
            .HasMaxLength(250);

        builder.Property(job => job.EmploymentType)
            .HasMaxLength(100);

        builder.Property(job => job.WorkMode)
            .HasMaxLength(100);

        builder.Property(job => job.MinimumSalary)
            .HasPrecision(12, 2);

        builder.Property(job => job.MaximumSalary)
            .HasPrecision(12, 2);

        builder.Property(job => job.Currency)
            .HasMaxLength(10);

        builder.Property(job => job.IsActive)
            .IsRequired();

        builder.Property(job => job.IsVerified)
            .IsRequired();

        builder.HasIndex(job => job.CompanyId);

        builder.HasIndex(job => job.ApplicationDeadlineUtc);

        builder.HasOne(job => job.Company)
            .WithMany(company => company.Jobs)
            .HasForeignKey(job => job.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(job => job.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureJobSkill(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<JobSkill> builder =
            modelBuilder.Entity<JobSkill>();

        builder.ToTable("JobSkills");

        builder.HasKey(jobSkill => jobSkill.Id);

        builder.Property(jobSkill => jobSkill.IsRequired)
            .IsRequired();

        builder.Property(jobSkill => jobSkill.MinimumProficiencyLevel)
            .IsRequired();

        builder.HasIndex(jobSkill =>
                new
                {
                    jobSkill.JobId,
                    jobSkill.SkillId
                })
            .IsUnique();

        builder.HasOne(jobSkill => jobSkill.Job)
            .WithMany(job => job.JobSkills)
            .HasForeignKey(jobSkill => jobSkill.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(jobSkill => jobSkill.Skill)
            .WithMany(skill => skill.JobSkills)
            .HasForeignKey(jobSkill => jobSkill.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(jobSkill => jobSkill.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureApplication(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<JobApplication> builder =
            modelBuilder.Entity<JobApplication>();

        builder.ToTable("Applications");

        builder.HasKey(application => application.Id);

        builder.Property(application => application.Status)
            .IsRequired();

        builder.Property(application => application.MatchScore)
            .HasPrecision(5, 2);

        builder.Property(application => application.EligibilityScore)
            .HasPrecision(5, 2);

        builder.Property(application => application.CoverLetter)
            .HasMaxLength(5000);

        builder.Property(application => application.AppliedAtUtc)
            .IsRequired();

        builder.HasIndex(application =>
                new
                {
                    application.CandidateProfileId,
                    application.JobId
                })
            .IsUnique();

        builder.HasIndex(application => application.Status);

        builder.HasOne(application => application.CandidateProfile)
            .WithMany()
            .HasForeignKey(application => application.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(application => application.Job)
            .WithMany(job => job.Applications)
            .HasForeignKey(application => application.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(application => application.Resume)
            .WithMany()
            .HasForeignKey(application => application.ResumeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(application => application.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureApplicationStatusHistory(
        ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<ApplicationStatusHistory> builder =
            modelBuilder.Entity<ApplicationStatusHistory>();

        builder.ToTable("ApplicationStatusHistories");

        builder.HasKey(history => history.Id);

        builder.Property(history => history.Status)
            .IsRequired();

        builder.Property(history => history.Notes)
            .HasMaxLength(2000);

        builder.Property(history => history.ChangedAtUtc)
            .IsRequired();

        builder.HasIndex(history => history.ApplicationId);

        builder.HasOne(history => history.Application)
            .WithMany(application => application.StatusHistory)
            .HasForeignKey(history => history.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(history => history.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureCareerRecommendation(
        ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<CareerRecommendation> builder =
            modelBuilder.Entity<CareerRecommendation>();

        builder.ToTable("CareerRecommendations");

        builder.HasKey(recommendation => recommendation.Id);

        builder.Property(recommendation => recommendation.CareerTitle)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(recommendation => recommendation.MatchScore)
            .HasPrecision(5, 2);

        builder.Property(recommendation => recommendation.Reason)
            .HasMaxLength(3000);

        builder.Property(recommendation => recommendation.RecommendedSkills)
            .HasMaxLength(2000);

        builder.Property(recommendation => recommendation.RecommendedJobTitles)
            .HasMaxLength(2000);

        builder.Property(recommendation => recommendation.GeneratedAtUtc)
            .IsRequired();

        builder.HasIndex(recommendation =>
            new
            {
                recommendation.CandidateProfileId,
                recommendation.CareerTitle
            });

        builder.HasOne(recommendation => recommendation.CandidateProfile)
            .WithMany(profile => profile.CareerRecommendations)
            .HasForeignKey(recommendation => recommendation.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(recommendation => recommendation.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureSkillGap(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<SkillGap> builder =
            modelBuilder.Entity<SkillGap>();

        builder.ToTable("SkillGaps");

        builder.HasKey(skillGap => skillGap.Id);

        builder.Property(skillGap => skillGap.RequiredProficiencyLevel)
            .IsRequired();

        builder.Property(skillGap => skillGap.CurrentProficiencyLevel)
            .IsRequired();

        builder.Property(skillGap => skillGap.GapLevel)
            .IsRequired();

        builder.Property(skillGap => skillGap.TargetRole)
            .HasMaxLength(250);

        builder.Property(skillGap => skillGap.IsResolved)
            .IsRequired();

        builder.HasIndex(skillGap =>
                new
                {
                    skillGap.CandidateProfileId,
                    skillGap.SkillId,
                    skillGap.TargetRole
                });

        builder.HasOne(skillGap => skillGap.CandidateProfile)
            .WithMany(profile => profile.SkillGaps)
            .HasForeignKey(skillGap => skillGap.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(skillGap => skillGap.Skill)
            .WithMany()
            .HasForeignKey(skillGap => skillGap.SkillId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(skillGap => skillGap.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureLearningRoadmap(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<LearningRoadmap> builder =
            modelBuilder.Entity<LearningRoadmap>();

        builder.ToTable("LearningRoadmaps");

        builder.HasKey(roadmap => roadmap.Id);

        builder.Property(roadmap => roadmap.TargetRole)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(roadmap => roadmap.Title)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(roadmap => roadmap.Description)
            .HasMaxLength(3000);

        builder.Property(roadmap => roadmap.EstimatedDurationWeeks)
            .IsRequired();

        builder.Property(roadmap => roadmap.ProgressPercentage)
            .IsRequired();

        builder.Property(roadmap => roadmap.IsCompleted)
            .IsRequired();

        builder.HasIndex(roadmap => roadmap.CandidateProfileId);

        builder.HasOne(roadmap => roadmap.CandidateProfile)
            .WithMany(profile => profile.LearningRoadmaps)
            .HasForeignKey(roadmap => roadmap.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(roadmap => roadmap.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureNotification(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Notification> builder =
            modelBuilder.Entity<Notification>();

        builder.ToTable("Notifications");

        builder.HasKey(notification => notification.Id);

        builder.Property(notification => notification.Title)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(notification => notification.Message)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(notification => notification.Type)
            .HasMaxLength(100);

        builder.Property(notification => notification.ActionUrl)
            .HasMaxLength(1000);

        builder.Property(notification => notification.IsRead)
            .IsRequired();

        builder.HasIndex(notification =>
                new
                {
                    notification.UserId,
                    notification.IsRead
                });

        builder.HasOne(notification => notification.User)
            .WithMany(user => user.Notifications)
            .HasForeignKey(notification => notification.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(notification => notification.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureReport(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<Report> builder =
            modelBuilder.Entity<Report>();

        builder.ToTable("Reports");

        builder.HasKey(report => report.Id);

        builder.Property(report => report.Reason)
            .IsRequired()
            .HasMaxLength(250);

        builder.Property(report => report.Description)
            .HasMaxLength(3000);

        builder.Property(report => report.Status)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(report => report.ResolutionNotes)
            .HasMaxLength(3000);

        builder.HasIndex(report => report.ReportedByUserId);

        builder.HasIndex(report => report.Status);

        builder.HasOne(report => report.ReportedByUser)
            .WithMany(user => user.Reports)
            .HasForeignKey(report => report.ReportedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(report => report.Job)
            .WithMany()
            .HasForeignKey(report => report.JobId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(report => report.Company)
            .WithMany()
            .HasForeignKey(report => report.CompanyId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(report => report.CreatedAtUtc)
            .IsRequired();
    }

    private static void ConfigureAuditLog(ModelBuilder modelBuilder)
    {
        EntityTypeBuilder<AuditLog> builder =
            modelBuilder.Entity<AuditLog>();

        builder.ToTable("AuditLogs");

        builder.HasKey(auditLog => auditLog.Id);

        builder.Property(auditLog => auditLog.Action)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(auditLog => auditLog.EntityName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(auditLog => auditLog.EntityId)
            .HasMaxLength(100);

        builder.Property(auditLog => auditLog.OldValues)
            .HasColumnType("jsonb");

        builder.Property(auditLog => auditLog.NewValues)
            .HasColumnType("jsonb");

        builder.Property(auditLog => auditLog.IpAddress)
            .HasMaxLength(100);

        builder.Property(auditLog => auditLog.UserAgent)
            .HasMaxLength(1000);

        builder.HasIndex(auditLog => auditLog.UserId);

        builder.HasIndex(auditLog =>
                new
                {
                    auditLog.EntityName,
                    auditLog.EntityId
                });

        builder.HasOne(auditLog => auditLog.User)
            .WithMany(user => user.AuditLogs)
            .HasForeignKey(auditLog => auditLog.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(auditLog => auditLog.CreatedAtUtc)
            .IsRequired();
    }
}