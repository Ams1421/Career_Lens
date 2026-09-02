using CareerLens.Application.DTOs;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class CandidateProfileService : ICandidateProfileService
{
    private readonly ICandidateProfileRepository _repository;

    public CandidateProfileService(
        ICandidateProfileRepository repository)
    {
        _repository = repository;
    }

    public async Task<CandidateProfileDto?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _repository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        return MapToDto(profile);
    }

    public async Task<CandidateProfileDto?> UpdateAsync(
        Guid userId,
        UpdateCandidateProfileDto request,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _repository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.FirstName))
        {
            profile.User.FirstName = request.FirstName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.LastName))
        {
            profile.User.LastName = request.LastName.Trim();
        }

        profile.PhoneNumber = request.PhoneNumber;
        profile.Location = request.Location;
        profile.Headline = request.Headline;
        profile.Bio = request.Bio;
        profile.ProfileImageUrl = request.ProfileImageUrl;
        profile.GraduationYear = request.GraduationYear;
        profile.CGPA = request.CGPA;
        profile.LinkedInUrl = request.LinkedInUrl;
        profile.GitHubUrl = request.GitHubUrl;
        profile.PortfolioUrl = request.PortfolioUrl;

        await _repository.UpdateAsync(
            profile,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(profile);
    }

    // Calculates profile completion based on filled profile fields.
    private static int CalculateProfileStrength(CandidateProfile profile)
    {
        var fields = new object?[]
        {
        profile.User.FirstName,
        profile.User.LastName,
        profile.User.Email,
        profile.PhoneNumber,
        profile.Location,
        profile.Headline,
        profile.Bio,
        profile.GraduationYear,
        profile.CGPA,
        profile.LinkedInUrl,
        profile.GitHubUrl,
        profile.PortfolioUrl,
        profile.ProfileImageUrl
        };

        var completed = fields.Count(field =>
            field != null &&
            !string.IsNullOrWhiteSpace(field.ToString()));

        return (int)Math.Round((completed / (double)fields.Length) * 100);
    }

    private static CandidateProfileDto MapToDto(
        CandidateProfile profile)
    {
        return new CandidateProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,

            FirstName = profile.User.FirstName,
            LastName = profile.User.LastName,
            Email = profile.User.Email,

            PhoneNumber = profile.PhoneNumber,
            Location = profile.Location,
            Headline = profile.Headline,
            Bio = profile.Bio,
            ProfileStrength = CalculateProfileStrength(profile),
            ProfileImageUrl = profile.ProfileImageUrl,
            GraduationYear = profile.GraduationYear,
            CGPA = profile.CGPA,
            LinkedInUrl = profile.LinkedInUrl,
            GitHubUrl = profile.GitHubUrl,
            PortfolioUrl = profile.PortfolioUrl
        };
    }
}