using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Dto;
using TaskBoard.Domain.Account;
using TaskBoard.Domain.User;
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
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await account.Register(registerDto);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await account.Login(loginDto);
            if (result)
            {
                var user = await account.GetUser(1);
                //var token = tokenService.GenerateToken();
                //var output = new AuthResponse
                //{
                //    Token = token,
                //    Email = loginDto.Email
                //};
                return Ok();
                ///return Ok(output);
            }
            return Unauthorized();
        }
    }
}
