using Microsoft.AspNetCore.Mvc;
using TaskBoard.Dto;
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
        private readonly ILogger<AccountController> logger;

        public AccountController(IAccountService account, IConfiguration configuration, ITokenService tokenService, ILogger<AccountController> logger)
        {
            this.account = account;
            this.configuration = configuration;
            this.tokenService = tokenService;
            this.logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            logger.LogDebug("Start registering user.");
            var result = await account.Register(registerDto);
            if (result)
            {
                logger.LogInformation("User registered successfully.");
                return Ok();
            }

            logger.LogInformation("User registration failed.");
            return BadRequest();
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            logger.LogDebug("Start logging in user.");
            var result = await account.Login(loginDto);
            if (result)
            {
                logger.LogInformation($"User: {loginDto.Email} logged in successfully.");
                var user = await account.GetUser(loginDto.Email);
                var token = tokenService.GenerateToken(user);
                var output = new AuthResponse
                {
                    Token = token,
                    Email = loginDto.Email
                };

                logger.LogInformation("Token generated successfully.");
                return Ok(output);
            }

            logger.LogDebug($"Login failed for user : {loginDto.Email}");
            return Unauthorized();
        }
    }
}
