using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;

namespace TaskBoard.Data.Mock
{
    public class TaskScheduleRepositoryMock : ITaskScheduleRepository
    {
        List<TaskSchedule> taskSchedules = new List<TaskSchedule>();
        public Task AddTaskSchedule(TaskSchedule taskSchedule)
        {
            taskSchedule.TaskScheduleId = taskSchedules.Count + 1;
            taskSchedules.Add(taskSchedule);

            return Task.FromResult(taskSchedule);
        }

        public Task DeleteTaskSchedule(int taskId, string userName)
        {
            var schedule = taskSchedules.FirstOrDefault(ts => ts.TaskId == taskId && ts.IsDeleted == false);
            if (schedule != null)
            {
                schedule.IsDeleted = true;
            }

            return Task.CompletedTask;
        }

        public Task<TaskSchedule> GetTaskSchedule(int taskId)
        {
            return Task.FromResult(taskSchedules.FirstOrDefault(ts => ts.TaskId == taskId && ts.IsDeleted == false));
        }
    }
}
