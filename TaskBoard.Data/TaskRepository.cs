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

        public async Task AddTaskDetail(UserTask userTask)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "UPDATE [Task] SET DESCRIPTION=@description, " +
                    "CATEGORYID=@categoryId, " +
                    "RowUpdatedDate=@rowUpdatedDate, " +
                    "RowUpdatedBy=@rowUpdatedBY" +
                    " WHERE TASKID=@taskId AND USERID=@userId";
                await connection.ExecuteAsync(sql, new { Description=userTask.Details, userTask.CategoryId, RowUpdatedDate= DateTime.Now, RowUpdatedBy = userTask.UserId.ToString(), userTask.TaskId, userTask.UserId });
            }
        }

        public async Task<UserTask> GetTask(int taskId, int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT TaskId,
                            CategoryId, 
                            UserId, 
                            Title, 
                            Description as Details, 
                            IsActive, 
                            IsDeleted, 
                            RowCreatedDate, 
                            RowCreatedBy, 
                            RowUpdatedDate, 
                            RowUpdatedBy
                            FROM [Task] 
                            WHERE UserId=@userId AND
                                  TaskId=@taskId AND
                                  IsDeleted=0 AND
                                  IsActive=1";

                var userTask = await connection.QueryFirstOrDefaultAsync<UserTask>(sql, new { userId, taskId });
                return userTask;
            }
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
