using TaskBoard.Domain.User;
using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface IAccountService
    {
        Task<bool> Register(RegisterDto registerDto);
        Task<bool> Login(LoginDto loginDto);
        Task<UserDto> GetUser(int id);
        //Task<UserDto> GetUser(string email);

    }
}
