using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.Data.Interfaces;
using TaskBoard.Dto;
using TaskBoard.Dto.Constants;
using TaskBoard.Service.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        public async Task<Dictionary<DateTime, List<UserTaskDto>>> GetScheduledTasksForToday(int userId)
        {
            var scheduledTasks = await _scheduledTasksRepository.GetTasks(userId);
            var scheduledTasksDto = _mapper.Map<IEnumerable<UserTaskDto>>(scheduledTasks);

            var data = scheduledTasksDto
                .Where(task => task.Schedule != null)
                .Where(task => !HasCompletedToday(task))
                 .Select(task => new { Task = task, Check = GetScheduleCheck(task) })
                .Where(x => x.Check.IsPastDue && x.Check.ScheduledDate.HasValue)
                .Select(x => new
                {
                    x.Task,
                    ScheduledDate = x.Check.ScheduledDate.Value.Date
                })
                .ToList();

            // Group by scheduled date and return as dictionary
            var grouped = data
                .GroupBy(x => x.ScheduledDate)
                .ToDictionary(g => g.Key, g => g.Select(x => x.Task).ToList());

            return grouped;
        }

        public async Task<Dictionary<DateTime, List<UserTaskDto>>> GetScheduledTasksPastDueDate(int userId)
        {
            var scheduledTasks = await _scheduledTasksRepository.GetTasks(userId);
            var scheduledTasksDto = _mapper.Map<IEnumerable<UserTaskDto>>(scheduledTasks);

            var data = scheduledTasksDto
                .Where(task => task?.Schedule != null)
                .Where(task => !HasCompletedToday(task))
                // project to include both the check result (bool) and computed date
                .Select(task => new { Task = task, Check = GetScheduleCheck(task) })
                .Where(x => x.Check.IsPastDue && x.Check.ScheduledDate.HasValue)
                .Select(x => new
                {
                    x.Task,
                    ScheduledDate = x.Check.ScheduledDate.Value.Date
                })
                .ToList();

            // Group by scheduled date and return as dictionary
            var grouped = data
                .GroupBy(x => x.ScheduledDate)
                .ToDictionary(g => g.Key, g => g.Select(x => x.Task).ToList());

            return grouped;
        }

        private ScheduleCheckResult GetScheduleCheck(UserTaskDto task)
        {
            var nextScheduledDate = GetTaskScheduleDate(task);
            var result = nextScheduledDate.HasValue && nextScheduledDate.Value.Date < DateTime.Now.Date;
            if (result)
            {
                return new ScheduleCheckResult(true, nextScheduledDate);
            }
            else
            {
                return new ScheduleCheckResult(false, null);
            }
        }

        private DateTime? GetTaskScheduleDate(UserTaskDto task)
        {
            return task.Schedule.Repeat switch
            {
                RepeatType.OneTime => GetScheduledDateOfOneTimeTask(task),
                RepeatType.Daily => GetScheduledDateOfDailyTask(task),
                RepeatType.Weekly => GetScheduledDateOfWeeklyTask(task),
                RepeatType.Monthly => GetScheduledDateOfMonthlyTask(task),
                RepeatType.Yearly => GetScheduledDateOfYearlyTask(task),
                RepeatType.Custom => GetScheduledDateOfCustomTask(task),
                _ => null
            };
        }

        private record ScheduleCheckResult(bool IsPastDue, DateTime? ScheduledDate);

        private DateTime? GetScheduledDateOfCustomTask(UserTaskDto task)
        {
            DateTime? scheduledDate = null;
            if (!IsRecurringTaskActive(task))
                return scheduledDate;

            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();
            var startDate = task.Schedule.StartDate;

            if (lastExecution == null)
            {
                scheduledDate = GetNextDateForCustomScheduledTask(startDate, task.Schedule.CustomRepeat, Convert.ToInt32(task.Schedule.CustomUnit));
            }
            else
            {
                scheduledDate = GetNextDateForCustomScheduledTask(lastExecution.CompletedDate, task.Schedule.CustomRepeat, Convert.ToInt32(task.Schedule.CustomUnit));
            }

            return scheduledDate;
        }

        private DateTime GetNextDateForCustomScheduledTask(DateTime startDate, string customRepeat, int customUnit)
        {
            return customRepeat switch
            {
                "days" => startDate.AddDays(customUnit),
                "weeks" => startDate.AddDays(7 * customUnit),
                "months" => startDate.AddMonths(customUnit),
                "years" => startDate.AddYears(customUnit),
                _ => new DateTime()
            };
        }
        private DateTime? GetScheduledDateOfWeeklyTask(UserTaskDto task)
        {
            DateTime? scheduledDate = null;
            if (!IsRecurringTaskActive(task))
                return scheduledDate;

            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();
            var startDate = task.Schedule.StartDate;

            if (lastExecution == null)
            {
                //scheduledDate = GetNextMatchingDay(startDate, task.Schedule.SelectedDays);
                scheduledDate = startDate.AddDays(7);
            }
            else
            {
                //scheduledDate = GetNextMatchingDay(lastExecution.CompletedDate, task.Schedule.SelectedDays);
                scheduledDate = lastExecution.CompletedDate.AddDays(7);
            }

            return scheduledDate;
        }
        private DateTime? GetScheduledDateOfYearlyTask(UserTaskDto task)
        {
            DateTime? scheduledDate = null;
            if (!IsRecurringTaskActive(task))
                return scheduledDate;

            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();
            var startDate = task.Schedule.StartDate;

            if (lastExecution == null)
            {
                scheduledDate = startDate.AddYears(1);
            }
            else
            {
                scheduledDate = lastExecution.CompletedDate.AddYears(1);
            }

            return scheduledDate;
        }

        private DateTime? GetScheduledDateOfMonthlyTask(UserTaskDto task)
        {
            DateTime? scheduledDate = null;
            if (!IsRecurringTaskActive(task))
                return scheduledDate;

            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();
            var startDate = task.Schedule.StartDate;

            if (lastExecution == null)
            {
                scheduledDate = startDate.AddMonths(1);
            }
            else
            {
                scheduledDate = lastExecution.CompletedDate.AddMonths(1);
            }

            return scheduledDate;
        }

        private DateTime? GetScheduledDateOfDailyTask(UserTaskDto task)
        {
            DateTime? scheduledDate = null;
            if (!IsRecurringTaskActive(task))
                return scheduledDate;

            var nextExecutionDate = task.Schedule.StartDate;
            var lastExecution = task.Instances.OrderByDescending(x => x.CompletedDate).FirstOrDefault();

            if (lastExecution != null)
            {
                nextExecutionDate = GetNextExecutionDate("daily", lastExecution.CompletedDate, 1);
            }

            scheduledDate = nextExecutionDate.Date < DateTime.Today ? nextExecutionDate : null;
            return scheduledDate;
        }

        private DateTime? GetScheduledDateOfOneTimeTask(UserTaskDto task)
        {
            var startDate = task.Schedule.StartDate.Date;

            // If there is any instance completed on or after the start date, it's not past due
            var instances = task.Instances ?? Enumerable.Empty<TaskInstanceDto>();
            var hasCompletedOnOrAfter = instances.Any(i => i.TaskId == task.TaskId && i.CompletedDate.Date >= startDate);

            if (hasCompletedOnOrAfter)
                return null;

            return startDate;
        }

        private bool IsRecurringTaskActive(UserTaskDto task)
        {
            return IsTaskWithinDateRange(task) && IsWithinEndAfterLimit(task);
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
