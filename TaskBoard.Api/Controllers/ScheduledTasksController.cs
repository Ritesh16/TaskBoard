using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ScheduledTasksController : ControllerBase
    {
        private readonly IScheduledTasksService _scheduledTasksService;

        public ScheduledTasksController(IScheduledTasksService scheduledTasksService)
        {
            _scheduledTasksService = scheduledTasksService;
        }
        [HttpGet("Today")]
        public async Task<IActionResult> GetScheduledTasks()
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);

            var tasks = await _scheduledTasksService.GetScheduledTasksForToday(id);
            return Ok(tasks);
        }

        [HttpGet("PastDue")]
        public async Task<IActionResult> GetScheduledTasksPastDue()
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);

            var tasks = await _scheduledTasksService.GetScheduledTasksPastDueDate(id);
            return Ok(tasks);
        }
    }
}
