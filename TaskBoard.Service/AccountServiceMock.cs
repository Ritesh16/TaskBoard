using TaskBoard.Domain.Account;
using TaskBoard.Domain.User;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class AccountServiceMock : IAccountService
    {
        List<User> users = new List<User>();

        public AccountServiceMock()
        {
            users.Add(new User { Email = "ritesh@gmail.com", Name = "Ritesh Sharma", UserId = 1, IsActive = true});
            users.Add(new User { Email = "user@gmail.com", Name = "Rob Smith", UserId = 2, IsActive = true });
        }
        public async Task<User> GetUser(int id)
        {
            return await Task.FromResult(users.FirstOrDefault(x => x.UserId == id));
        }

        public async Task<User> GetUser(string email)
        {
            return await Task.FromResult(users.FirstOrDefault(x => x.Email == email));
        }

        public async Task<bool> Login(string email, string password)
        {
            return await Task.FromResult(users.Any(x => x.Email.ToLower() == email.ToLower()));
        }

        public async Task<bool> Register(User user, UserCredential userCredential)
        {
            user.UserId = users.Count() + 1;

            users.Add(user);
            return await Task.FromResult(true);
        }
    }
}
