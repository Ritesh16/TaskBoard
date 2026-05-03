using AutoMapper;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System.Collections.Generic;
using System.Linq;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Dto;
using TaskBoard.Service.Profiles;
using Xunit;

namespace TaskBoard.Service.Tests
{
    public class ScheduledTasksServiceTests
    {
        List<UserTask> userTasks;
        MapperConfiguration mapperConfig;
        public ScheduledTasksServiceTests()
        {
            userTasks = new List<UserTask>
            {
                new UserTask
                {
                   Title = "Sample Task-1",
                   TaskId = 1,
                   Schedule = new TaskSchedule
                   {
                       TaskScheduleId = 1,
                       TaskId = 1,
                       Frequency = "OneTime",
                       StartDate = DateTime.Now.AddDays(-5), // Yesterday
                   },
                   TaskInstances = new List<TaskInstance>()
                   {
                       new TaskInstance
                       {
                           CompletedDate = DateTime.Now.AddDays(-2),
                           RowCreateDate = DateTime.Now,
                           TaskId=1,
                           TaskInstanceId = 1,
                           TaskScheduleId=1
                       }
                   }
                },
                new UserTask
                {
                   Title = "Sample Task-2",
                   TaskId = 2,
                   Schedule = new TaskSchedule
                   {
                       TaskScheduleId = 2,
                       TaskId = 2,
                       Frequency = "Daily",
                       StartDate = DateTime.Now.AddDays(-1), // Yesterday
                   },
                   TaskInstances = new List<TaskInstance>()
                },
                new UserTask
                {
                   Title = "Sample Task-3",
                   TaskId = 3,
                   Schedule = new TaskSchedule
                   {
                       TaskScheduleId = 3,
                       TaskId = 3,
                       Frequency = "OneTime",
                       StartDate = DateTime.Now.AddDays(-5), // Yesterday
                   }
                },
                new UserTask
                {
                   Title = "Sample Task-4",
                   TaskId = 4,
                   Schedule = new TaskSchedule
                   {
                       TaskScheduleId = 4,
                       TaskId = 4,
                       Frequency = "Daily",
                       StartDate = DateTime.Now.AddDays(-5), // Yesterday
                   },
                   TaskInstances = new List<TaskInstance>()
                   {
                       new TaskInstance
                       {
                           CompletedDate = DateTime.Now,
                           RowCreateDate = DateTime.Now,
                           TaskId=4,
                           TaskInstanceId = 2,
                           TaskScheduleId=4
                       }
                   }
                },
            };

            //mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile(new MappingProfiles()));
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfiles());
            }, NullLoggerFactory.Instance);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_OneTimeTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 3);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_DailyTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 2);
            //Assert.DoesNotContain(result, r => r.Value.Where(x => x.TaskId == 5));
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_WeeklyTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            var userTask = new UserTask
            {
                Title = "Weekly Task-5",
                TaskId = 5,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 5,
                    TaskId = 5,
                    Frequency = "Weekly",
                    StartDate = DateTime.Now.AddDays(-8), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 5);
        }
        
        [Fact]
        public async Task GetScheduledTasksPastDueDate_MonthlyTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Monthly Task",
                TaskId = 6,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 6,
                    TaskId = 6,
                    Frequency = "Monthly",
                    StartDate = DateTime.Now.AddDays(-35), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 6);
        }
        [Fact]
        public async Task GetScheduledTasksPastDueDate_YearlyTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Yearly Task",
                TaskId = 7,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 7,
                    TaskId = 7,
                    Frequency = "Yearly",
                    StartDate = DateTime.Now.AddDays(-368), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 7);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_CustomEvery2DaysTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Custom Task",
                TaskId = 8,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 8,
                    TaskId = 8,
                    Frequency = "Custom",
                    Interval = "Every 2-days",
                    StartDate = DateTime.Now.AddDays(-4), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 8);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_CustomEvery3WeeksTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Custom Task",
                TaskId = 8,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 8,
                    TaskId = 8,
                    Frequency = "Custom",
                    Interval = "Every 3-weeks",
                    StartDate = DateTime.Now.AddDays(-22), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 8);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_CustomEvery4MonthsTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Custom Task",
                TaskId = 8,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 8,
                    TaskId = 8,
                    Frequency = "Custom",
                    Interval = "Every 4-months",
                    StartDate = DateTime.Now.AddDays(-135), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 8);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_CustomEvery1YearTaskPastDue_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            userTasks = new List<UserTask>();
            var userTask = new UserTask
            {
                Title = "Custom Task",
                TaskId = 8,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 8,
                    TaskId = 8,
                    Frequency = "Custom",
                    Interval = "Every 1-year",
                    StartDate = DateTime.Now.AddDays(-368), // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksPastDueDate(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 8);
        }

        [Fact]
        public async Task GetScheduledTasksDueToday_NoOneTimeTaskFound_NoTaskFound()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksForToday(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Equal(0, all.Count);
        }

        [Fact]
        public async Task GetScheduledTasksDueToday_OneTimeTaskDueToday_TaskFound()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            var userTask = new UserTask
            {
                Title = "OneTime Task",
                TaskId = 100,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 100,
                    TaskId = 100,
                    Frequency = "OneTime",
                    StartDate = DateTime.Now, // Yesterday
                }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksForToday(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 100);
        }

        [Fact]
        public async Task GetScheduledTasksDueToday_DailyTaskDueToday_TaskFound()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            var userTask = new UserTask
            {
                Title = "Daily Task",
                TaskId = 100,
                Schedule = new TaskSchedule
                {
                    TaskScheduleId = 100,
                    TaskId = 100,
                    Frequency = "Daily",
                    StartDate = DateTime.Now.AddDays(-2), // Yesterday
                },
                TaskInstances = new List<TaskInstance>()
                   {
                       new TaskInstance
                       {
                           CompletedDate = DateTime.Now.AddDays(-2),
                           RowCreateDate = DateTime.Now,
                           TaskId=100,
                           TaskInstanceId = 1,
                           TaskScheduleId=1
                       },
                       new TaskInstance
                       {
                           CompletedDate = DateTime.Now.AddDays(-1),
                           RowCreateDate = DateTime.Now,
                           TaskId=100,
                           TaskInstanceId = 1,
                           TaskScheduleId=1
                       }
                   }
            };

            userTasks.Add(userTask);

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = await service.GetScheduledTasksForToday(1);
            var all = result.SelectMany(kvp => kvp.Value).ToList();

            // Assert
            Assert.Contains(all, r => r.TaskId == 100);
        }

    }
}
