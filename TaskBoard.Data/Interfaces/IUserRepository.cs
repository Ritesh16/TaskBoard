using TaskBoard.Domain.User;

namespace TaskBoard.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<User> AddUser(User user);
        Task<bool> AddCredentials(UserCredential userCredential);
        //Task<bool> Login(string email, string Password, string hash);
        Task<User> GetUser(int userId);
        Task<User> GetUser(string email);
    }
}
