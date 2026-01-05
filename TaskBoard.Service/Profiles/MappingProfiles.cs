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
            CreateMap<TaskSchedule, TaskScheduleDto>()
                .ForMember(x => x.SelectedDays, o => o.MapFrom(u => u.DaysOfWeek))
                .ForMember(x => x.Repeat, o => o.MapFrom(u => u.Frequency))
                .ForMember(x => x.EndAfter, o => o.MapFrom(u => u.StopAfter))
                .ForMember(x => x.CustomUnit, o => o.MapFrom(u => u.Interval.Split(' ')[1].Split('-')[0]))
                .ForMember(x => x.CustomRepeat, o => o.MapFrom(u => u.Interval.Split(' ')[1].Split('-')[1])).ReverseMap();
        }
    }
}
