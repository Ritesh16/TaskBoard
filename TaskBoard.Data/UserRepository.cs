using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
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
        public async Task<bool> AddCredentials(UserCredential userCredential)
        {
            var result = false;
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "INSERT INTO [USERCREDENTIAL](UserId,Password) VALUES(@userId, @password);";
                await connection.ExecuteAsync(sql, new { userCredential.UserId, userCredential.Password });
                result = true;
            }

            return result;
        }

        public async Task<User> GetUser(int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT *
                            FROM [USER] u 
                            WHERE UserId=@userId";

                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { userId });
                return user;
            }
        }

        public async Task<User> GetUser(string email)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT u.UserId, u.Name, u.Email, u.IsActive,
                            uc.UserCredentialId, uc.UserId, uc.Password
                            FROM [USER] u 
                            INNER JOIN USERCREDENTIAL uc ON u.UserId=uc.UserId
                            WHERE EMAIL=@email";


                var user = await connection.QueryAsync<User, UserCredential, User>(sql, (user, userCredential) =>
                {
                    user.UserCredential = userCredential;
                    return user;

                }, new { email }, 
                splitOn: "UserId");
                
                if (user != null)
                {
                    return user.FirstOrDefault();
                }

                return null!;
            }
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
    }
}
