using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskBoard.Api.Dtos;
using TaskBoard.Domain.Task;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskSchedulesController : ControllerBase
    {
        private readonly ITaskScheduleService taskScheduleService;

        public TaskSchedulesController(ITaskScheduleService taskScheduleService)
        {
            this.taskScheduleService = taskScheduleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTaskSchedules(int taskId)
        {
            var taskSchedules = await taskScheduleService.GetTaskSchedule(taskId);
            return Ok(taskSchedules);
        }

        [HttpPost]
        public async Task<IActionResult> SaveTaskSchedule([FromBody] TaskScheduleDto taskScheduleDto)
        {
            var name = User.FindFirstValue("name");
            if(string.IsNullOrEmpty(name))
            {
                return Unauthorized();
            }

            var taskSchedule = new TaskSchedule()
            {
                TaskId = taskScheduleDto.TaskId,
                StartDate = taskScheduleDto.StartDate,
                Frequency = taskScheduleDto.Repeat,
                DaysOfWeek = taskScheduleDto.SelectedDays,
                RowCreatedBy = name,
                RowUpdatedBy = name
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

            await taskScheduleService.AddTaskSchedule(taskSchedule);

            return Ok();
        }
    }
}
