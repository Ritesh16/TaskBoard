using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskBoard.Dto;
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

            taskScheduleDto.UserName = name;
            await taskScheduleService.AddTaskSchedule(taskScheduleDto);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTaskSchedule(int taskId)
        {
            var name = User.FindFirstValue("name");
            if (string.IsNullOrEmpty(name))
            {
                return Unauthorized();
            }

            await taskScheduleService.DeleteTaskSchedule(taskId);
            return Ok();
        }
    }
}
