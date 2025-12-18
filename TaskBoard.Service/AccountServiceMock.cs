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

        public async Task<UserDto> GetUser(string email)
        {
            var user = await userRepository.GetUser(email);
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
            if(addUserResult != null)
            {
                var userCredential = mapper.Map<UserCredential>(registerDto);
                userCredential.UserId = addUserResult.UserId;
                addCredentialResult = await userRepository.AddCredentials(userCredential);
            }

            return addUserResult != null && addCredentialResult;
        }
    }
}
