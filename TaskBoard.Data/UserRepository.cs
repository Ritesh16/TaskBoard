using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.User;

namespace TaskBoard.Data
{
    public class UserRepository : IUserRepository
    {
        public Task<bool> AddCredentials(UserCredential userCredential)
        {
            throw new NotImplementedException();
        }

        public Task<bool> AddUser(User user)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUser(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUser(string email)
        {
            throw new NotImplementedException();
        }

        public Task<User> Login(string userName, string Password)
        {
            throw new NotImplementedException();
        }

        Task<User> IUserRepository.AddUser(User user)
        {
            throw new NotImplementedException();
        }

        Task<bool> IUserRepository.Login(string email, string Password)
        {
            throw new NotImplementedException();
        }
    }
}
