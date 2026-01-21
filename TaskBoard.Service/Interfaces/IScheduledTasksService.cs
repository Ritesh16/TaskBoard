using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface IScheduledTasksService
    {
        Task<IEnumerable<UserTaskDto>> GetScheduledTasksPastDueDate(int userId);
        Task<IEnumerable<UserTaskDto>> GetScheduledTasksForToday(int userId);
    }
}
