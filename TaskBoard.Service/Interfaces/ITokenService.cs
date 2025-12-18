using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserDto userDto);
    }
}
