using TaskBoard.Domain.Task;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
        Task AddTask(AddTask addTask);
        Task AddTaskDetail(TaskDetail taskDetail);
        Task AddTaskSchedule(TaskSchedule taskSchedule);
        Task<UserTask> GetTask(int taskId);
    }
}
