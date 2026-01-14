using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface IScheduledTasksService
    {
        Task<IEnumerable<UserTaskDto>> GetScheduledTasksForToday(int userId);
    }
}
