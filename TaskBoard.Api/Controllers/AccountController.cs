using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Domain.Account;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService account;
        private readonly IConfiguration configuration;
        private readonly ITokenService tokenService;

        public AccountController(IAccountService account, IConfiguration configuration, ITokenService tokenService)
        {
            this.account = account;
            this.configuration = configuration;
            this.tokenService = tokenService;
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
                var token = tokenService.GenerateToken(login.Email);
                var output = new AuthResponse
                {
                    Token = token,
                    Email = login.Email
                };

                return Ok(output);
            }
            return Unauthorized();
        }
    }
}
