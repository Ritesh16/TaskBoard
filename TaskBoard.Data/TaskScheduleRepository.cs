using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Domain.User;

namespace TaskBoard.Data
{
    public class TaskScheduleRepository : ITaskScheduleRepository
    {
        private readonly string _connectionString;

        public TaskScheduleRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task AddTaskSchedule(TaskSchedule taskSchedule)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "INSERT INTO [TaskSchedule](TaskId, Frequency, Interval, DaysOfWeek, StartDate, EndDate, StopAfter)" +
                    " VALUES(@taskId, @frequency, @interval, @daysOfWeek, @startDate, @endDate, @stopAfter);";

                await connection.ExecuteAsync(sql, new { 
                    taskSchedule.TaskId, 
                    taskSchedule.Frequency,
                    taskSchedule.Interval,
                    taskSchedule.DaysOfWeek,
                    taskSchedule.StartDate, 
                    taskSchedule.EndDate,
                    taskSchedule.StopAfter 
                });
            }
        }

        public async Task DeleteTaskSchedule(int taskId, string userName)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = "UPDATE [TaskSchedule] SET ISDELETED=1, " +
                    "RowUpdatedDate=@rowUpdatedDate, " +
                    "RowUpdatedBy=@rowUpdatedBy" +
                    " WHERE TASKID=@taskId";
                await connection.ExecuteAsync(sql, new { RowUpdatedDate = DateTime.Now, RowUpdatedBy = userName, taskId });
            }
        }

        public async Task<TaskSchedule> GetTaskSchedule(int taskId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                const string sql = @"SELECT 
                                TaskScheduleId,
                                TaskId,
                                Frequency,
                                Interval,
                                DaysOfWeek,
                                StartDate,
                                EndDate,
                                StopAfter,
                                IsDeleted,
                                RowCreatedDate,
                                RowCreatedBy,
                                RowUpdatedDate,
                                RowUpdatedBy
                            FROM
                            [TaskSchedule] 
                            WHERE TaskId=@taskId AND
                                  IsDeleted=0";

                var taskSchedule = await connection.QueryFirstOrDefaultAsync<TaskSchedule>(sql, new { taskId });
                return taskSchedule;
            }
        }
    }
}
