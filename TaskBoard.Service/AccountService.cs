using TaskBoard.Domain.Account;
using TaskBoard.Domain.User;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class AccountService : IAccountService
    {
        List<User> users = new List<User>();
        public Task<User> GetUser(int id)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUser(string email)
        {
            return Task.FromResult(users.FirstOrDefault(x => x.Email == email));
        }

        public Task<bool> Login(Login login)
        {
            return Task.FromResult(users.Any(x => x.Email == login.Email));
        }

        public Task<bool> Register(Register register)
        {
            var user = new User
            {
                Id = users.Count + 1,
                Name = register.Name,
                Email = register.Email
            };

            users.Add(user);
            return Task.FromResult(true);
        }
    }
}
