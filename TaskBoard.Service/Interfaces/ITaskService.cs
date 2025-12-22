using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTaskDto>> GetTasks(int userId);
        Task AddTask(AddTaskDto userTaskDto);
        Task AddTaskDetail(TaskDetailDto userTask);
        Task<UserTaskDto> GetTask(int taskId);
    }
}
