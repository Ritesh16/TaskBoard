using TaskBoard.Domain.Task;

namespace TaskBoard.Data.Interfaces
{
    public interface ITaskScheduleRepository
    {
        Task<TaskSchedule> GetTaskSchedule(int taskId);
        Task AddTaskSchedule(TaskSchedule taskSchedule);
        Task DeleteTaskSchedule(int taskId, string userName);
    }
}
