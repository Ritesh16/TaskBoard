using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;

namespace TaskBoard.Data
{
    public class ScheduledTasksRepository : IScheduledTasksRepository
    {
        private readonly string _connectionString;

        public ScheduledTasksRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public async Task<IEnumerable<UserTask>> GetTasks(int userId)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                var taskLookup = new Dictionary<int, UserTask>();

                connection.Open();
                const string sql = @"SELECT  t.TaskId, t.CategoryId, 
		c.Name, t.Title, t.Description, t.IsActive, t.IsDeleted,
		ts.TaskScheduleId, ts.TaskId, ts.Frequency, ts.Frequency, ts.Interval, ts.DaysOfWeek, ts.StartDate, ts.EndDate, ts.StopAfter, ts.IsDeleted,
		ti.TaskInstanceId, ti.Taskid, ti.TaskScheduleId, ti.CompletedDate
                            FROM Task t
                            INNER JOIN Category c ON t.CategoryId = c.CategoryId AND c.IsDeleted = 0    
                            LEFT OUTER JOIN TaskSchedule ts ON t.TaskId = ts.TaskId AND ts.IsDeleted = 0
                            LEFT OUTER JOIN TaskInstance ti ON t.TaskId = ti.TaskId
                            WHERE c.UserId=@userId";

                var catgeories = await connection.QueryAsync<UserTask, TaskSchedule, TaskInstance, UserTask>(sql, (task, taskSchedule, taskInstance) =>
                {
                    if (!taskLookup.TryGetValue(task.TaskId, out var t))
                    {
                        t = task;
                        if (taskSchedule != null)
                            t.Schedule = taskSchedule;

                        t.TaskInstances ??= new List<TaskInstance>();
                        //t.TaskInstances = taskInstance;
                        taskLookup.Add(t.TaskId, t);
                    }
                    else
                    {
                        if (t.Schedule == null && taskSchedule != null)
                            t.Schedule = taskSchedule;
                    }


                    if (taskInstance != null)
                    {
                        if (!t.TaskInstances.Any(ti => ti.TaskInstanceId == taskInstance.TaskInstanceId))
                            t.TaskInstances.Add(taskInstance);
                    }

                    return t;
                },
              new { userId },
              splitOn: "TaskScheduleId,TaskInstanceId");

                var tasks = taskLookup.Values.ToList();
                return tasks;
            }
        }
    }
}
