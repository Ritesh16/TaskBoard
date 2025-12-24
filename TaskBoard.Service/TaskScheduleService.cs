using System.Xml.Linq;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class TaskScheduleService : ITaskScheduleService
    {
        private readonly ITaskScheduleRepository taskScheduleRepository;

        public TaskScheduleService(ITaskScheduleRepository taskScheduleRepository)
        {
            this.taskScheduleRepository = taskScheduleRepository;
        }
        public Task AddTaskSchedule(TaskScheduleDto taskScheduleDto)
        {
            var taskSchedule = new TaskSchedule()
            {
                TaskId = taskScheduleDto.TaskId,
                StartDate = taskScheduleDto.StartDate,
                Frequency = taskScheduleDto.Repeat,
                DaysOfWeek = taskScheduleDto.SelectedDays,
                RowCreatedBy = taskScheduleDto.UserName,
                RowUpdatedBy = taskScheduleDto.UserName
            };

            if (taskScheduleDto.EndType == "endDate")
            {
                taskSchedule.EndDate = taskScheduleDto.EndDate;
            }

            if (taskScheduleDto.EndType == "endAfter")
            {
                taskSchedule.StopAfter = taskScheduleDto.EndAfter;
            }

            if (taskScheduleDto.Repeat.ToLower() == "custom")
            {
                taskSchedule.Interval = $"Every {taskScheduleDto.CustomRepeat}-{taskScheduleDto.CustomUnit}";
            }

            return Task.FromResult(taskSchedule);
        }

        public async Task<TaskSchedule> GetTaskSchedule(int taskId)
        {
            return await taskScheduleRepository.GetTaskSchedule(taskId);
        }

        public async Task DeleteTaskSchedule(int taskId)
        {
            await taskScheduleRepository.DeleteTaskSchedule(taskId);
        }
    }
}
