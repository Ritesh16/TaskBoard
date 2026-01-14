using TaskBoard.Domain.Task;

namespace TaskBoard.Data.Interfaces
{
    public interface IScheduledTasksRepository
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
    }
}
