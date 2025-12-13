using TaskBoard.Domain.Task;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskScheduleService
    {
        Task<TaskSchedule> GetTaskSchedule(int taskId);
        Task AddTaskSchedule(TaskSchedule taskSchedule);
        Task DeleteTaskSchedule(int taskId);
    }
}
