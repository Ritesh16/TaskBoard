using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Api.Dtos;
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
            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                IsActive = true,
                RowCreateDate = DateTime.Now,
                RowCreatedBy = registerDto.Email,
                RowUpdateDate = DateTime.Now,
                RowUpdatedBy = registerDto.Email,
            };

            var userCredential = new UserCredential
            {
                Password = registerDto.Password,
                IsActive = true,
                RowCreateDate = DateTime.Now,
                RowCreatedBy = registerDto.Email,
                RowUpdateDate = DateTime.Now,
                RowUpdatedBy = registerDto.Email,
            };

            var result = await account.Register(user, userCredential);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await account.Login(loginDto.Email, loginDto.Password);
            if (result)
            {
                var user = await account.GetUser(loginDto.Email);
                var token = tokenService.GenerateToken(user);
                var output = new AuthResponse
                {
                    Token = token,
                    Email = loginDto.Email
                };

                return Ok(output);
            }
            return Unauthorized();
        }
    }
}
