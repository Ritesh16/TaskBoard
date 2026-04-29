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

        private ScheduleCheckResult CheckTasksDueToday(UserTaskDto task)
        {
            var nextScheduledDate = GetTaskScheduleDate(task);
            var result = nextScheduledDate.HasValue && nextScheduledDate.Value.Date == DateTime.Now.Date;
            if (result)
            {
                return new ScheduleCheckResult(true, nextScheduledDate);
            }
            else
            {
                return new ScheduleCheckResult(false, null);
            }
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

        private DateTime GetNextMatchingDay(DateTime startDate, int[] allowedWeekdays)
        {
            DateTime current = startDate;

            while (true)
            {
                // Convert C# DayOfWeek (0=Sunday ... 6=Saturday) to your format (0=Monday ... 6=Sunday)
                int weekday = ((int)current.DayOfWeek + 6) % 7;

                if (allowedWeekdays.Contains(weekday))
                    return current;

                current = current.AddDays(1);
            }
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
