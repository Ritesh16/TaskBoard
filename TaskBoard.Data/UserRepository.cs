using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.User;

namespace TaskBoard.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public Task<bool> AddCredentials(UserCredential userCredential)
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

        public async Task<User> AddUser(User user)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "INSERT INTO [USER](Name, Email) VALUES(@name, @email);  SELECT CAST(SCOPE_IDENTITY() AS int);";
                var id = await connection.QuerySingleAsync<int>(sql, new { user.Name, user.Email, user.IsActive });
                user.UserId = id;
            }

            return user;
        }

        Task<bool> IUserRepository.Login(string email, string Password)
        {
            throw new NotImplementedException();
        }
    }
}
