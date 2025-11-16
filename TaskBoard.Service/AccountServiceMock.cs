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
            users.Add(new User { Email = "ritesh@gmail.com", Name = "Ritesh Sharma", Id = 1});
            users.Add(new User { Email = "user@gmail.com", Name = "Rob Smith", Id = 2 });
        }
        public async Task<User> GetUser(int id)
        {
            return await Task.FromResult(users.FirstOrDefault(x => x.Id == id));
        }

        public async Task<User> GetUser(string email)
        {
            return await Task.FromResult(users.FirstOrDefault(x => x.Email == email));
        }

        public async Task<bool> Login(Login login)
        {
            return await Task.FromResult(users.Any(x => x.Email == login.Email));
        }

        public async Task<bool> Register(Register register)
        {
            var user = new User
            {
                Id = users.Count + 1,
                Name = register.Name,
                Email = register.Email
            };

            users.Add(user);
            return await Task.FromResult(true);
        }
    }
}
