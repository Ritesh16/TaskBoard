using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Domain.Task;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class TaskScheduleServiceMock : ITaskScheduleService
    {
        List<TaskSchedule> taskSchedules = new List<TaskSchedule>();
        public Task AddTaskSchedule(TaskSchedule taskSchedule)
        {
            taskSchedule.TaskScheduleId = taskSchedules.Count + 1;
            taskSchedules.Add(taskSchedule);

            return Task.FromResult(taskSchedule);
        }

        public Task<TaskSchedule> GetTaskSchedule(int taskId)
        {
            return Task.FromResult(taskSchedules.FirstOrDefault(ts => ts.TaskId == taskId));
        }
    }
}
