using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskBoard.Domain.Task;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService taskService;
        private readonly IAccountService accountService;

        public TasksController(ITaskService taskService, IAccountService accountService)
        {
            this.taskService = taskService;
            this.accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);

            if (string.IsNullOrEmpty(userId))
            {
                // This should not happen if the [Authorize] attribute is present, but it's safe.
                return Unauthorized("Invalid user token.");
            }
            else
            {
             
                var user = await accountService.GetUser(id);
                if (user == null)
                {
                    return Unauthorized("User not found in the system.");
                }
            }

            var tasks = await taskService.GetTasks(id);
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AddTask addTask)
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);

            addTask.UserId = id;

            await taskService.AddTask(addTask);
            return Ok();
        }
    }
}
