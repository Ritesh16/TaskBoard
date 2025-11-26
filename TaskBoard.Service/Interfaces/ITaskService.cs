using TaskBoard.Domain.Task;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
        Task AddTask(AddTask addTask);
        Task AddTaskDetail();
        Task<UserTask> GetTask(int taskId);

    }
}
