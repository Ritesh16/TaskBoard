using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTaskDto>> GetTasks(int userId);
        Task AddTask(AddTaskDto userTaskDto);
        Task AddTaskDetail(TaskDetailDto userTask);
        Task<UserTaskDto> GetTask(int taskId, int userId);
        Task<IEnumerable<UserTaskDto>> GetTasksScheduledForToday(int userId);
        Task<IEnumerable<UserTaskDto>> GetTasksScheduled(int userId, DateTime startDate, DateTime endDate);
    }
}
