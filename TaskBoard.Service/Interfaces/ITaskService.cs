using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Domain.Task;

namespace TaskBoard.Service.Interfaces
{
    public interface ITaskService
    {
        Task<IEnumerable<UserTask>> GetTasks(int userId);
        Task AddTask(AddTask addTask);
        Task AddTaskDetail();

    }
}
