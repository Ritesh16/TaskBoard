using AutoMapper;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.User;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class AccountService : IAccountService
    {
        private readonly IUserRepository userRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public AccountService(IUserRepository userRepository, ICategoryRepository categoryRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.categoryRepository = categoryRepository;
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
            var user = await userRepository.GetUser(loginDto.Email);
            bool isValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.UserCredential.Password);

            return isValid;
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
                string hash = BCrypt.Net.BCrypt.HashPassword(userCredential.Password, workFactor: 12);
                userCredential.Password = hash;
                addCredentialResult = await userRepository.AddCredentials(userCredential);

                var categoryDto = new UserCategoryDto
                {
                    UserId = addUserResult.UserId,
                    Name = "General",
                    Description = "General category",
                    IsActive = true
                };

                await categoryRepository.AddCategory(mapper.Map<UserCategory>(categoryDto));
            }

            return addUserResult != null && addCredentialResult;
        }
    }
}
