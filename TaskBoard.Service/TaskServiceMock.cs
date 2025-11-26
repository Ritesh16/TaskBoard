using TaskBoard.Domain.Task;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class TaskServiceMock : ITaskService
    {
        List<UserTask> list = new List<UserTask>();
        public Task AddTask(AddTask addTask)
        {
            var userTask = new UserTask 
            { 
                CategoryName = "General", 
                Title = addTask.Title, 
                TaskId = list.Count + 1, 
                Date = DateTime.Now, 
                UserId = addTask.UserId 
            };

            list.Add(userTask);

            return Task.FromResult(userTask);
        }
        public Task AddTaskDetail()
        {
            throw new NotImplementedException();
        }

        public Task<UserTask> GetTask(int taskId)
        {
            return Task.FromResult(list.FirstOrDefault(x => x.TaskId == taskId));
        }

        public async Task<IEnumerable<UserTask>> GetTasks(int userId)
        {
            var tasks = GetTasks().Where(x => x.UserId == userId);
            return await Task.FromResult(tasks);
        }

        private IEnumerable<UserTask> GetTasks()
        {
            var userTask = new UserTask()
            {
                CategoryName = "General",
                Date = DateTime.Now,
                TaskId = 1,
                Title = "Task-1",
                UserId = 1
            };

            list.Add(userTask);
            return list;
        }
    }
}
