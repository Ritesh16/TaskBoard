using TaskBoard.Domain.User;

namespace TaskBoard.Service.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
