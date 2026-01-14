using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using TaskBoard.Data.Interfaces;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class ScheduledTasksService : IScheduledTasksService
    {
        private readonly IScheduledTasksRepository _scheduledTasksRepository;
        private readonly IMapper _mapper;

        public ScheduledTasksService(IScheduledTasksRepository scheduledTasksRepository, IMapper mapper)
        {
            _scheduledTasksRepository = scheduledTasksRepository;
            _mapper = mapper;
        }
        public async Task<IEnumerable<UserTaskDto>> GetScheduledTasksForToday(int userId)
        {
            var scheduledTasks = await _scheduledTasksRepository.GetTasks(userId);
            var scheduledTasksDto = _mapper.Map<IEnumerable<UserTaskDto>>(scheduledTasks);
            return scheduledTasksDto;
        }
    }
}
