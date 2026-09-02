using CareerLens.Application.DTOs.JobSkills;
using CareerLens.Application.Interfaces;
using CareerLens.Domain.Entities;

namespace CareerLens.Application.Services;

public class JobSkillService : IJobSkillService
{
    private readonly IJobSkillRepository _repository;

    public JobSkillService(IJobSkillRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<JobSkillDto>> GetByJobAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        return (await _repository.GetByJobIdAsync(jobId, cancellationToken))
            .Select(Map).ToList();
    }

    public async Task<JobSkillDto?> CreateAsync(CreateJobSkillDto request, CancellationToken cancellationToken = default)
    {
        var job = await _repository.GetJobAsync(request.JobId, cancellationToken);
        var skill = await _repository.GetSkillAsync(request.SkillId, cancellationToken);

        if (job is null || skill is null)
            return null;

        if (await _repository.ExistsAsync(request.JobId, request.SkillId, null, cancellationToken))
            return null;

        JobSkill entity = new()
        {
            Id = Guid.NewGuid(),
            JobId = request.JobId,
            SkillId = request.SkillId,
            Job = job,
            Skill = skill,
            IsRequired = request.IsRequired,
            MinimumProficiencyLevel = request.MinimumProficiencyLevel,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _repository.AddAsync(entity, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<JobSkillDto?> UpdateAsync(Guid id, UpdateJobSkillDto request, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return null;

        var job = await _repository.GetJobAsync(request.JobId, cancellationToken);
        var skill = await _repository.GetSkillAsync(request.SkillId, cancellationToken);

        if (job is null || skill is null)
            return null;

        entity.JobId = request.JobId;
        entity.SkillId = request.SkillId;
        entity.Job = job;
        entity.Skill = skill;
        entity.IsRequired = request.IsRequired;
        entity.MinimumProficiencyLevel = request.MinimumProficiencyLevel;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(entity);
        await _repository.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return false;

        _repository.Delete(entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static JobSkillDto Map(JobSkill entity)
    {
        return new JobSkillDto
        {
            Id = entity.Id,
            JobId = entity.JobId,
            SkillId = entity.SkillId,
            SkillName = entity.Skill.Name,
            Category = entity.Skill.Category,
            IsRequired = entity.IsRequired,
            MinimumProficiencyLevel = entity.MinimumProficiencyLevel
        };
    }
}