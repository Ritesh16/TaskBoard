using AutoMapper;
using TaskBoard.Domain.User;
using TaskBoard.Dto;

namespace TaskBoard.Service.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<RegisterDto, User>();
            CreateMap<RegisterDto, UserCredential>();
        }
    }
}
