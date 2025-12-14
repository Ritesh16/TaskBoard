using TaskBoard.Domain.User;

namespace TaskBoard.Service.Interfaces
{
    public interface IAccountService
    {
        Task<bool> Register(User user, UserCredential userCredential);
        Task<bool> Login(string email, string password);
        Task<User> GetUser(int id);
        Task<User> GetUser(string email);

    }
}
