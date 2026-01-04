using TaskBoard.Domain.Task;
using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskScheduleService
    {
        Task<TaskSchedule> GetTaskSchedule(int taskId);
        Task AddTaskSchedule(TaskScheduleDto taskScheduleDto);
        Task DeleteTaskSchedule(int taskId, string userName);
    }
}
