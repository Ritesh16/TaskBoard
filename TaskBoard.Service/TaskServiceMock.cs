using AutoMapper;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class TaskServiceMock : ITaskService
    {
        private readonly ITaskRepository taskRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public TaskServiceMock(ITaskRepository taskRepository, ICategoryRepository categoryRepository,
                IMapper mapper)
        {
            this.taskRepository = taskRepository;
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
        }

        public async Task AddTask(AddTaskDto userTaskDto)
        {
            var userTask = mapper.Map<UserTask>(userTaskDto);
            var userCategory = await categoryRepository.GetDefaultCategory(userTaskDto.UserId);
            userTask.CategoryId = userCategory.CategoryId;
            await taskRepository.AddTask(userTask);
        }
        public async Task AddTaskDetail(TaskDetailDto userTaskDto)
        {
            var userTask = await taskRepository.GetTask(userTaskDto.TaskId);
            userTask.Details = userTaskDto.Details;
            userTask.CategoryId = userTaskDto.CategoryId;
            userTask.RowUpdateDate = DateTime.Now;
            userTask.RowUpdatedBy = "System";

            await taskRepository.AddTaskDetail(userTask);
        }

        public async Task<UserTaskDto> GetTask(int taskId)
        {
            var userTask = await taskRepository.GetTask(taskId);
            return mapper.Map<UserTaskDto>(userTask);
        }

        public async Task<IEnumerable<UserTaskDto>> GetTasks(int userId)
        {
            var userTasks = await taskRepository.GetTasks(userId);
            return mapper.Map<IEnumerable<UserTaskDto>>(userTasks);
        }
    }
}
