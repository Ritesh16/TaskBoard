using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.User;

namespace TaskBoard.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task AddCategory(UserCategory userCategory)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "INSERT INTO [CATEGORY](UserId,Name,Description) VALUES(@userId, @name, @description);";
                await connection.ExecuteAsync(sql, new { userCategory.UserId, userCategory.Name, userCategory.Description });
            }
        }

        public async Task<UserCategory> GetDefaultCategory(int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT *
                            FROM Category 
                            WHERE UserId=@userId AND
                               NAME='General'";

                var userCategory = await connection.QueryFirstOrDefaultAsync<UserCategory>(sql, new { userId });
                return userCategory;
            }
        }

        public async Task<IEnumerable<UserCategory>> GetUserCategories(int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT *
                            FROM Category 
                            WHERE UserId=@userId";

                var categories = await connection.QueryAsync<UserCategory>(sql, new { userId });
                return categories;
            }
        }
    }
}
