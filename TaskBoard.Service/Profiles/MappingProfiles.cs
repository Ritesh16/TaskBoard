using AutoMapper;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.Task;
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
            CreateMap<AddTaskDto, UserTask>();
            CreateMap<UserTaskDto, UserTask>()
                 .ForMember(x => x.RowCreateDate, o => o.MapFrom(u => u.Date)).ReverseMap();

            CreateMap<RegisterDto, UserCredential>();
            CreateMap<UserCategory, UserCategoryDto>().ReverseMap();
        }
    }
}
