using TaskBoard.Domain.Account;
using TaskBoard.Domain.User;

namespace TaskBoard.Service.Interfaces
{
    public interface IAccountService
    {
        Task<bool> Register(Register register);
        Task<bool> Login(Login login);
        Task<User> GetUser(int id);
        Task<User> GetUser(string email);

    }
}
