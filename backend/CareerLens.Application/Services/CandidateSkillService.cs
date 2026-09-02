using CareerLens.Application.DTOs.Skills;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class CandidateSkillService : ICandidateSkillService
{
    private readonly ICandidateSkillRepository _repository;
    private readonly ICandidateProfileRepository _candidateProfileRepository;

    public CandidateSkillService(
        ICandidateSkillRepository repository,
        ICandidateProfileRepository candidateProfileRepository)
    {
        _repository = repository;
        _candidateProfileRepository =
            candidateProfileRepository;
    }

    public async Task<IReadOnlyList<CandidateSkillDto>>
        GetMySkillsAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return [];
        }

        IReadOnlyList<CandidateSkill> skills =
            await _repository.GetByCandidateProfileIdAsync(
                profile.Id,
                cancellationToken);

        return skills
            .Select(MapToDto)
            .ToList();
    }

    public async Task<CandidateSkillDto?> AddAsync(
        Guid userId,
        AddCandidateSkillDto request,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        Skill? skill =
            await _repository.GetActiveSkillAsync(
                request.SkillId,
                cancellationToken);

        if (skill is null)
        {
            return null;
        }

        bool alreadyExists =
            await _repository.ExistsAsync(
                profile.Id,
                request.SkillId,
                cancellationToken);

        if (alreadyExists)
        {
            return null;
        }

        CandidateSkill candidateSkill = new()
        {
            Id = Guid.NewGuid(),
            CandidateProfileId = profile.Id,
            SkillId = request.SkillId,
            ProficiencyLevel =
                request.ProficiencyLevel,
            YearsOfExperience =
                request.YearsOfExperience,
            CreatedAtUtc = DateTime.UtcNow,
            Skill = skill
        };

        await _repository.AddAsync(
            candidateSkill,
            cancellationToken);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(candidateSkill);
    }

    public async Task<CandidateSkillDto?> UpdateAsync(
        Guid userId,
        Guid candidateSkillId,
        AddCandidateSkillDto request,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return null;
        }

        CandidateSkill? candidateSkill =
            await _repository.GetByIdAsync(
                candidateSkillId,
                profile.Id,
                cancellationToken);

        if (candidateSkill is null)
        {
            return null;
        }

        Skill? skill =
            await _repository.GetActiveSkillAsync(
                request.SkillId,
                cancellationToken);

        if (skill is null)
        {
            return null;
        }

        if (candidateSkill.SkillId != request.SkillId)
        {
            bool alreadyExists =
                await _repository.ExistsAsync(
                    profile.Id,
                    request.SkillId,
                    cancellationToken);

            if (alreadyExists)
            {
                return null;
            }
        }

        candidateSkill.SkillId = request.SkillId;
        candidateSkill.ProficiencyLevel =
            request.ProficiencyLevel;
        candidateSkill.YearsOfExperience =
            request.YearsOfExperience;
        candidateSkill.Skill = skill;
        candidateSkill.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(candidateSkill);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return MapToDto(candidateSkill);
    }

    public async Task<bool> DeleteAsync(
        Guid userId,
        Guid candidateSkillId,
        CancellationToken cancellationToken = default)
    {
        CandidateProfile? profile =
            await _candidateProfileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        if (profile is null)
        {
            return false;
        }

        CandidateSkill? candidateSkill =
            await _repository.GetByIdAsync(
                candidateSkillId,
                profile.Id,
                cancellationToken);

        if (candidateSkill is null)
        {
            return false;
        }

        _repository.Delete(candidateSkill);

        await _repository.SaveChangesAsync(
            cancellationToken);

        return true;
    }

    private static CandidateSkillDto MapToDto(
        CandidateSkill candidateSkill)
    {
        return new CandidateSkillDto
        {
            Id = candidateSkill.Id,
            SkillId = candidateSkill.SkillId,
            SkillName = candidateSkill.Skill.Name,
            Category = candidateSkill.Skill.Category,
            ProficiencyLevel =
                candidateSkill.ProficiencyLevel,
            YearsOfExperience =
                candidateSkill.YearsOfExperience
        };
    }
}