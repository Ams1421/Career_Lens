using CareerLens.Domain.Enums;

namespace CareerLens.Application.DTOs.Auth;

public class AuthResponse
{
    public Guid UserId { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    // NEW: Return user role to frontend
    public UserRole Role { get; set; }

    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAtUtc { get; set; }
}