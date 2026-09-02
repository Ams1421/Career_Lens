using CareerLens.Application.DTOs.Auth;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;
using CareerLens.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace CareerLens.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenService jwtTokenService,
        IPasswordHasher<User> passwordHasher)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        string email = request.Email.Trim().ToLowerInvariant();

        bool emailExists =
            await _userRepository.EmailExistsAsync(email, cancellationToken);

        if (emailExists)
            throw new InvalidOperationException(
                "An account with this email already exists.");

        User user = new()
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            Role = request.Role,          // Candidate or Employer
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        // Only candidates get a CandidateProfile
        if (user.Role == UserRole.Candidate)
        {
            CandidateProfile profile = new()
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                CreatedAtUtc = DateTime.UtcNow
            };

            user.CandidateProfile = profile;
        }

        await _userRepository.AddAsync(user, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        string email = request.Email.Trim().ToLowerInvariant();

        User? user =
            await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (user is null || !user.IsActive)
            return null;

        PasswordVerificationResult result =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        user.LastLoginAtUtc = DateTime.UtcNow;

        await _userRepository.SaveChangesAsync(cancellationToken);

        return CreateAuthResponse(user);
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        (string token, DateTime expiresAtUtc) =
            _jwtTokenService.GenerateToken(user);

        return new AuthResponse
        {
            UserId = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            Token = token,
            ExpiresAtUtc = expiresAtUtc
        };
    }

    public async Task<string?> ForgotPasswordAsync(
        ForgotPasswordRequestDto request,
        CancellationToken cancellationToken = default)
    {
        string email = request.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(
            email,
            cancellationToken);

        if (user == null)
            return null;

        user.PasswordResetToken =
            Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

        user.PasswordResetTokenExpiryUtc =
            DateTime.UtcNow.AddMinutes(15);

        _userRepository.Update(user);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return user.PasswordResetToken;
    }

    public async Task<bool> ResetPasswordAsync(
        ResetPasswordRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByPasswordResetTokenAsync(
            request.Token,
            cancellationToken);

        if (user == null)
            return false;

        if (user.PasswordResetTokenExpiryUtc == null ||
            user.PasswordResetTokenExpiryUtc < DateTime.UtcNow)
            return false;

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.NewPassword);

        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiryUtc = null;

        _userRepository.Update(user);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return true;
    }
}