using TaskBoard.Domain.Task;

namespace TaskBoard.Data.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
        Task AddTask(UserTask userTask);
        Task AddTaskDetail(UserTask userTask);
        Task<UserTask?> GetTask(int taskId, int userId);
    }
}
