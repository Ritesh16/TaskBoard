using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.Task;
using TaskBoard.Domain.User;

namespace TaskBoard.Data
{
    public class TaskRepository : ITaskRepository
    {
        private readonly string _connectionString;

        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task AddTask(UserTask userTask)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "INSERT INTO [Task](CategoryId, UserId, Title) VALUES(@categoryId, @userId, @title);";
                await connection.ExecuteAsync(sql, new { userTask.CategoryId, userTask.UserId, userTask.Title });
            }
        }

        public Task AddTaskDetail(UserTask userTask)
        {
            throw new NotImplementedException();
        }

        public Task<UserTask> GetTask(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<UserTask>> GetTasks(int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT *
                            FROM [Task] 
                            WHERE UserId=@userId AND
                                  IsActive=1";

                var categories = await connection.QueryAsync<UserTask>(sql, new { userId });
                return categories;
            }
        }
    }
}
