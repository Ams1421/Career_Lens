using CareerLens.Domain.Common;
using CareerLens.Domain.Enums;

namespace CareerLens.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
    
    public string? PasswordResetToken { get; set; }
    
    public DateTime? PasswordResetTokenExpiryUtc { get; set; }

    public UserRole Role { get; set; } = UserRole.Candidate;

    public DateTime? LastLoginAtUtc { get; set; }

    public CandidateProfile? CandidateProfile { get; set; }

    public ICollection<Notification> Notifications { get; set; } =
        new List<Notification>();

    public ICollection<Report> Reports { get; set; } =
        new List<Report>();

    public ICollection<AuditLog> AuditLogs { get; set; } =
        new List<AuditLog>();
}