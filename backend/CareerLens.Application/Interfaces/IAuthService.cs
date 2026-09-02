using CareerLens.Application.DTOs.Auth;

namespace CareerLens.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<AuthResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<string?> ForgotPasswordAsync(
    ForgotPasswordRequestDto request,
    CancellationToken cancellationToken = default);

    Task<bool> ResetPasswordAsync(
        ResetPasswordRequestDto request,
        CancellationToken cancellationToken = default);
}