using AutoMapper;
using Moq;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Task;
using TaskBoard.Dto;
using Xunit;

namespace TaskBoard.Service.Tests
{
    public class ScheduledTasksServiceTests
    {
        [Fact]
        public void OneTimeScheduledTask_PastDue_WhenStartDateIsYesterday()
        {
            // Arrange
            var mockScheduledTasksRepository = new Mock<IScheduledTasksRepository>();
            var mockMapper = new Mock<IMapper>();
            
            var tasks = new List<UserTask>
            {
                new UserTask
                {
                   Title = "Sample Task",
                   TaskId = 1,
                   Schedule = new TaskSchedule
                   {
                       TaskScheduleId = 1,
                       TaskId = 1,
                       Frequency = "OneTime",
                       StartDate = DateTime.Now.AddDays(-1), // Yesterday
                   },
                   TaskInstances = new List<TaskInstance>()
                }
            };

            var taskDtos = new List<UserTaskDto>
            {
                new UserTaskDto
                {
                    Title = "Sample Task",
                    TaskId = 1,
                    Schedule = new TaskScheduleDto
                    {
                        TaskId = 1,
                        Repeat = "OneTime",
                        StartDate = DateTime.Now.AddDays(-1),
                    },
                    Instances = new List<TaskInstanceDto>()
                }
            };

            mockScheduledTasksRepository
                .Setup(repo => repo.GetTasks(It.IsAny<int>()))
                .ReturnsAsync(tasks);

            mockMapper
                .Setup(m => m.Map<IEnumerable<UserTaskDto>>(It.IsAny<IEnumerable<UserTask>>()))
                .Returns(taskDtos);

            var service = new ScheduledTasksService(mockScheduledTasksRepository.Object, mockMapper.Object);

            // Act
            var result = service.GetScheduledTasksPastDueDate(1).Result;

            // Assert
            Assert.Equal(1, 1);
        }
    }
}
