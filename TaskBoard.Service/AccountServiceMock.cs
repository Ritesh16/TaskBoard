using AutoMapper;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Account;
using TaskBoard.Domain.User;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class AccountServiceMock : IAccountService
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public AccountServiceMock(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<UserDto> GetUser(int id)
        {
            var user = await userRepository.GetUser(id);
            return mapper.Map<UserDto>(user);
        }

        public async Task<bool> Login(LoginDto loginDto)
        {
            return await userRepository.Login(loginDto.Email, loginDto.Password);
        }

        public async Task<bool> Register(RegisterDto registerDto)
        {
            var user = mapper.Map<User>(registerDto);
            var addUserResult = await userRepository.AddUser(user);
            var addCredentialResult = false;
            if(addUserResult)
            {
                await userRepository.AddCredentials(null);
            }


            return addUserResult && addCredentialResult;
        }
    }
}
