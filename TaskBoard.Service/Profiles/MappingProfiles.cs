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
                 .ForMember(dest => dest.RowCreateDate, o => o.MapFrom(src => src.Date))
                 .ForMember(dest => dest.TaskInstances, o => o.MapFrom(src => src.Instances))
                 .ReverseMap()
                 .ForMember(dest => dest.Date, o => o.MapFrom(src => src.RowCreateDate))
                 .ForMember(dest => dest.Instances, o => o.MapFrom(src => src.TaskInstances));

            CreateMap<RegisterDto, UserCredential>();
            CreateMap<UserCategory, UserCategoryDto>().ReverseMap();
            CreateMap<TaskSchedule, TaskScheduleDto>()
               .ForMember(dest => dest.SelectedDays,
               opt => opt.MapFrom(src => MapHelpers.ParseDaysOfWeek(src.DaysOfWeek)))
                .ForMember(x => x.Repeat, o => o.MapFrom(u => u.Frequency))
                .ForMember(x => x.EndAfter, o => o.MapFrom(u => u.StopAfter))
                .ForMember(x => x.CustomUnit, o => o.MapFrom(u => u.Interval.Split(' ')[1].Split('-')[0]))
                .ForMember(x => x.CustomRepeat, o => o.MapFrom(u => u.Interval.Split(' ')[1].Split('-')[1])).ReverseMap();

            CreateMap<TaskInstance, TaskInstanceDto>().ReverseMap();
        }
    }

    public static class MapHelpers
    {
        public static List<int> ParseDaysOfWeek(string daysOfWeek)
        {
            if (string.IsNullOrWhiteSpace(daysOfWeek)) return new List<int>();
            return daysOfWeek
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => int.TryParse(s, out _))    // local delegate allowed here
                .Select(int.Parse)
                .ToList();
        }
    }

}
