using TaskBoard.Domain.User;

namespace TaskBoard.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> AddUser(User user);
        Task<bool> AddCredentials(UserCredential userCredential);
        Task<bool> Login(string email, string Password);
        Task<User> GetUser(int userId);
    }
}
