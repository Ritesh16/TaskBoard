using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.User;

namespace TaskBoard.Data.Mock
{
    public class UserRepositoryMock : IUserRepository
    {
        List<User> users = new List<User>();
        List<UserCredential> userCredentials = new List<UserCredential>();
        public UserRepositoryMock()
        {
            users.Add(new User { Email = "ritesh@gmail.com", Name = "Ritesh Sharma", UserId = 1, IsActive = true });
            users.Add(new User { Email = "user@gmail.com", Name = "Rob Smith", UserId = 2, IsActive = true });
        }
        public Task<bool> AddCredentials(UserCredential userCredential)
        {
            userCredentials.Add(userCredential);
            return Task.FromResult(true);
        }

        public Task<User> AddUser(User user)
        {
            users.Add(user);
            user.UserId = users.Count + 1;
            return Task.FromResult(user);
        }

        public Task<User> GetUser(int userId)
        {
            return Task.FromResult(users.FirstOrDefault(x => x.UserId == userId));
        }

        public Task<User> GetUser(string email)
        {
            return Task.FromResult(users.FirstOrDefault(x => x.Email.ToLower() == email.ToLower()));
        }

        public Task<bool> Login(string email, string Password)
        {
            var result = true;
            var user = users.FirstOrDefault(x => x.Email.ToLower() == email.ToLower());
            if (user == null)
            {
                result = false;
            }
            
            return Task.FromResult(result);
        }
    }
}
