using AutoMapper;
using Moq;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Dto;
using Xunit;
using TaskBoard.Service.Profiles;

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

            mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile(new MappingProfiles()));

        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_OneTimeTask_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = (await service.GetScheduledTasksPastDueDate(1)).ToList();

            // Assert
            Assert.Contains(result, r => r.TaskId == 3);
        }

        [Fact]
        public async Task GetScheduledTasksPastDueDate_DailyTask_ReturnsTask()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(userTasks);

            IMapper mapper = mapperConfig.CreateMapper();

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mapper);

            // Act
            var result = (await service.GetScheduledTasksPastDueDate(1)).ToList();

            // Assert
            Assert.Contains(result, r => r.TaskId == 2);
            Assert.DoesNotContain(result, r => r.TaskId == 4);
        }
    }
}
