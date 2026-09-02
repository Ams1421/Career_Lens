using CareerLens.Domain.Entities;

namespace CareerLens.Application.Interfaces;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(User user);
}