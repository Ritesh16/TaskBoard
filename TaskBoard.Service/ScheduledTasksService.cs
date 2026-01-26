using AutoMapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.Data.Interfaces;
using TaskBoard.Dto;
using TaskBoard.Dto.Constants;
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

            return scheduledTasksDto
                .Where(task => task.Schedule != null)
                .Where(task => !HasCompletedToday(task))
                .Where(ShouldScheduleTaskToday)
                .ToList();
        }

        public async Task<IEnumerable<UserTaskDto>> GetScheduledTasksPastDueDate(int userId)
        {
            var scheduledTasks = await _scheduledTasksRepository.GetTasks(userId);
            var scheduledTasksDto = _mapper.Map<IEnumerable<UserTaskDto>>(scheduledTasks);

            return scheduledTasksDto
                .Where(task => task.Schedule != null)
                .Where(task => !HasCompletedToday(task))
                .Where(ShouldScheduleTaskPastDue)
                .ToList();
        }
        private bool ShouldScheduleTaskToday(UserTaskDto task)
        {
            return task.Schedule.Repeat switch
            {
                RepeatType.OneTime => IsOneTimeTaskDue(task),
                RepeatType.Daily => IsRecurringTaskActive(task),
                RepeatType.Weekly => IsWeeklyTaskDue(task),
                RepeatType.Monthly => IsMonthlyTaskDue(task),
                RepeatType.Yearly => IsYearlyTaskDue(task),
                RepeatType.Custom => IsCustomTaskDue(task),
                _ => false
            };
        }

        private bool ShouldScheduleTaskPastDue(UserTaskDto task)
        {
            return task.Schedule.Repeat switch
            {
                RepeatType.OneTime => IsOneTimeTaskPastDue(task),
                RepeatType.Daily => IsDailyTaskPastDue(task),
                RepeatType.Weekly => IsWeeklyTaskPastDue(task),
                RepeatType.Monthly => IsMonthlyTaskDue(task),
                RepeatType.Yearly => IsYearlyTaskDue(task),
                RepeatType.Custom => IsCustomTaskDue(task),
                _ => false
            };
        }

        private bool IsDailyTaskPastDue(UserTaskDto task)
        {
            var result = false;
            if (!IsRecurringTaskActive(task))
                return result;

            var nextExecutionDate = task.Schedule.StartDate;
            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();

            if (lastExecution != null)
            {
                nextExecutionDate = GetNextExecutionDate("daily", lastExecution.CompletedDate, 1);
            }

            result = nextExecutionDate.Date < DateTime.Today;
            return result;
        }

        private bool IsOneTimeTaskPastDue(UserTaskDto task)
        {
            var startDate = task.Schedule.StartDate.Date;
            var today = DateTime.Now.Date;

            // If there is any instance completed on or after the start date, it's not past due
            var instances = task.Instances ?? Enumerable.Empty<TaskInstanceDto>();
            var hasCompletedOnOrAfter = instances.Any(i => i.TaskId == task.TaskId && i.CompletedDate.Date >= startDate);

            return !hasCompletedOnOrAfter;
        }

        private bool IsOneTimeTaskDue(UserTaskDto task)
        {
            return task.Schedule.StartDate.Date == DateTime.Now.Date;
        }

        private bool IsRecurringTaskActive(UserTaskDto task)
        {
            return IsTaskWithinDateRange(task) && IsWithinEndAfterLimit(task);
        }
        private bool IsWeeklyTaskPastDue(UserTaskDto task)
        {
            if (!IsRecurringTaskActive(task))
                return false;

            var nextExecutionDate = task.Schedule.StartDate;
            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();

            if (lastExecution != null)
            {
                nextExecutionDate = GetNextExecutionDate("weeks", lastExecution.CompletedDate, 1);
            }

            var days = task.Schedule.SelectedDays
                .Select(day => day)
                .OrderBy(d => d)
                .ToList();

            var startingDay = days[0];

            if (task.Schedule.StartDate.DayOfWeek != (DayOfWeek)startingDay)
            {
                var difference = Math.Abs(Convert.ToInt32(task.Schedule.StartDate.DayOfWeek) - startingDay);
                nextExecutionDate = nextExecutionDate.AddDays(difference);
            }


            return nextExecutionDate.Date < DateTime.Today;
        }

        private bool IsWeeklyTaskDue(UserTaskDto task)
        {
            if (!IsRecurringTaskActive(task))
                return false;

            return task.Schedule.SelectedDays.Any(day =>
                DateTime.Now.DayOfWeek == (DayOfWeek)day);
        }

        private bool IsMonthlyTaskDue(UserTaskDto task)
        {
            if (!IsRecurringTaskActive(task))
                return false;

            var nextExecutionDate = GetNextExecutionDateForMonthly(task);
            return nextExecutionDate.Date == DateTime.Now.Date;
        }

        private bool IsYearlyTaskDue(UserTaskDto task)
        {
            if (!IsRecurringTaskActive(task))
                return false;

            var nextExecutionDate = GetNextExecutionDateForYearly(task);
            return nextExecutionDate.Date == DateTime.Now.Date;
        }

        private bool IsCustomTaskDue(UserTaskDto task)
        {
            if (!IsRecurringTaskActive(task))
                return false;

            var nextExecutionDate = task.Schedule.StartDate;
            var interval = Convert.ToInt32(task.Schedule.CustomUnit);

            var lastExecution = GetLastTaskInstance(task);

            if (lastExecution != null)
            {
                nextExecutionDate = GetNextExecutionDate(task.Schedule.CustomRepeat, lastExecution.CompletedDate, interval);
            }

            return nextExecutionDate.Date == DateTime.Now.Date;
        }

        private bool IsTaskWithinDateRange(UserTaskDto task)
        {
            var today = DateTime.Now.Date;
            return task.Schedule.StartDate.Date <= today &&
                   (task.Schedule.EndDate == null || task.Schedule.EndDate.Value.Date >= today);
        }

        private bool IsWithinEndAfterLimit(UserTaskDto task)
        {
            if (task.Schedule.EndAfter == null)
                return true;

            var maxInstances = Convert.ToInt32(task.Schedule.EndAfter);
            var currentInstanceCount = task.Instances.Count(x => x.TaskId == task.TaskId);
            return currentInstanceCount < maxInstances;
        }

        private bool HasCompletedToday(UserTaskDto task)
        {
            return task.Instances.Any(x =>
                x.TaskId == task.TaskId &&
                x.CompletedDate.Date == DateTime.Now.Date);
        }

        private DateTime GetNextExecutionDateForMonthly(UserTaskDto task)
        {
            var lastInstance = GetLastTaskInstance(task);
            if (lastInstance != null)
            {
                return GetNextExecutionDate("months", lastInstance.CompletedDate, 1);
            }

            return task.Schedule.StartDate.AddMonths(1);
        }

        private DateTime GetNextExecutionDateForYearly(UserTaskDto task)
        {
            var lastInstance = GetLastTaskInstance(task);
            if (lastInstance != null)
            {
                return GetNextExecutionDate("years", lastInstance.CompletedDate, 1);
            }

            return task.Schedule.StartDate.AddYears(1);
        }

        private TaskInstanceDto GetLastTaskInstance(UserTaskDto task)
        {
            if (task.Instances == null || !task.Instances.Any())
                return null;

            return task.Instances
                .Where(x => x.TaskId == task.TaskId)
                .OrderByDescending(x => x.TaskInstanceId)
                .FirstOrDefault();
        }

        private DateTime GetNextExecutionDate(string repeatOn, DateTime lastExecutionDate, int interval) =>
            repeatOn.ToLower() switch
            {
                "weeks" => lastExecutionDate.AddDays(7 * interval),
                "months" => lastExecutionDate.AddMonths(interval),
                "years" => lastExecutionDate.AddYears(interval),
                "days" => lastExecutionDate.AddDays(interval),
                "daily" => lastExecutionDate.AddDays(interval),

                _ => lastExecutionDate
            };


    }
}
