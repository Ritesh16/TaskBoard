using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;

namespace TaskBoard.Data.Mock
{
    public class TaskRepositoryMock : ITaskRepository
    {
        List<UserTask> list = new List<UserTask>();

        public TaskRepositoryMock()
        {
        }

        public Task AddTask(UserTask userTask)
        {
            userTask.TaskId = list.Count + 1;
            list.Add(userTask);
            return Task.FromResult(userTask);
        }
        public Task AddTaskDetail(UserTask userTask)
        {
            var task = list.FirstOrDefault(x => x.TaskId == userTask.TaskId);
            if (task != null)
            {
                task.Details = userTask.Details;
                task.CategoryId = userTask.CategoryId;
            }

            return Task.CompletedTask;
        }

        public Task<UserTask> GetTask(int taskId, int userId)
        {
            return Task.FromResult(list.FirstOrDefault(x => x.TaskId == taskId && x.UserId == userId));
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
                CategoryId = 1,
                RowCreateDate = DateTime.Now,
                RowCreatedBy = "user",
                RowUpdateDate = DateTime.Now,
                RowUpdatedBy = "user",
                TaskId = 1,
                Title = "Task-1",
                UserId = 2
            };

            if (list.Count == 0)
            {
                list.Add(userTask);
            }

            return list;
        }
    }
}
