using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService account;

        public AccountController(IAccountService account)
        {
            this.account = account;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Domain.Account.Register register)
        {
            var result = await account.Register(register);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Domain.Account.Login login)
        {
            var result = await account.Login(login);
            if (result)
            {
                return Ok();
            }
            return Unauthorized();
        }
    }
}
