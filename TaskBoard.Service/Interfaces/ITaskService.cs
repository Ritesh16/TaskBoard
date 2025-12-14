using TaskBoard.Domain.Task;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
        Task AddTask(UserTask userTask);
        Task AddTaskDetail(UserTask userTask);
        Task<UserTask> GetTask(int taskId);
    }
}
