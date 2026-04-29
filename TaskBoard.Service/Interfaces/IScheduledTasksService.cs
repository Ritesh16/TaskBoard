using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface IScheduledTasksService
    {
        Task<Dictionary<DateTime, List<UserTaskDto>>> GetScheduledTasksPastDueDate(int userId);
        Task<Dictionary<DateTime, List<UserTaskDto>>> GetScheduledTasksForToday(int userId);
    }
}
