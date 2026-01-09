using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.Task;
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
                var categoryLookup = new Dictionary<int, UserCategory>();

                connection.Open();
                const string sql = @"SELECT c.*, t.*
                            FROM Category c
                            LEFT OUTER JOIN TASK t ON c.CategoryId = t.CategoryId AND t.IsActive = 1 AND t.IsDeleted = 0
                            WHERE c.UserId=@userId";

                var catgeories = await connection.QueryAsync<UserCategory, UserTask, UserCategory>(sql, (category, task) =>
                {
                    if (!categoryLookup.TryGetValue(category.CategoryId, out var cat))
                    {
                        cat = category;
                        cat.Tasks = new List<UserTask>();
                        categoryLookup.Add(cat.CategoryId, cat);
                    }
                    // task can be null when there is no matching row (LEFT JOIN)
                    if (task != null)
                    {
                        cat.Tasks.Add(task);
                    }

                    return cat;
                },
              new { userId },
              splitOn: "CategoryId");

                var categories = categoryLookup.Values.ToList();
                return categories;

            }
        }
    }
}
