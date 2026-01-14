using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;

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
                await connection.ExecuteAsync(sql, new { Description = userTask.Details, userTask.CategoryId, RowUpdatedDate = DateTime.Now, RowUpdatedBy = userTask.UserId.ToString(), userTask.TaskId, userTask.UserId });
            }
        }

        public async Task<UserTask?> GetTask(int taskId, int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT t.TaskId,
                            t.CategoryId, 
                            t.UserId, 
                            t.Title, 
                            t.Description as Details, 
                            t.IsActive, 
                            t.IsDeleted, 
                            t.RowCreatedDate, 
                            t.RowCreatedBy, 
                            t.RowUpdatedDate, 
                            t.RowUpdatedBy,
                            ts.TaskScheduleId,
                            ts.TaskId,
                            ts.Frequency,
                            ts.Interval,
                            ts.DaysOfWeek,
                            ts.StartDate, 
                            ts.EndDate,
                            ts.StopAfter
                            FROM [Task] t
                            LEFT OUTER JOIN [TaskSchedule] ts ON t.TaskId=ts.TaskId AND  ts.IsDeleted=0
                            WHERE t.UserId=@userId AND
                                  t.TaskId=@taskId AND
                                  t.IsDeleted=0 AND
                                  t.IsActive=1";

                var userTask = await connection.QueryAsync<UserTask, TaskSchedule, UserTask>(sql, (task, taskSchedule) =>
                {
                    task.Schedule = taskSchedule;
                    return task;
                },
                new { userId, taskId },
                splitOn: "TaskScheduleId");

                return userTask?.FirstOrDefault();
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
