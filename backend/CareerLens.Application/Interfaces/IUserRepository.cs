using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        User user,
        CancellationToken cancellationToken = default);

    Task<bool> EmailExistsAsync(
        string email,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);

    void Update(User user);

    Task<User?> GetByPasswordResetTokenAsync(
    string token,
    CancellationToken cancellationToken = default);
}