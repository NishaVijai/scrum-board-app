using Moq;
using Moq.EntityFrameworkCore;
using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Models;
using Scrum_Board_Backend.Services;
using System.Net;

namespace ScrumBoardBackend.Test;

[TestClass]
public class ScrumBoardServiceTests
{
    private static ScrumBoardService GetService(IScrumBoardContext context) => new ScrumBoardService(context);

    [TestMethod]
    public async Task GetAllTasks_Multiple()
    {
        // Arrange
        var task1 = new TaskEntity
        {
            Title = "Research Elephants"
        };
        var task2 = new TaskEntity
        {
            Title = "Raise Elephants"
        };
        var task3 = new TaskEntity
        {
            Title = "Train Elephants"
        };
        IEnumerable<TaskEntity> expected = new[] { task1, task2, task3 };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task1, task2, task3]);

        var service = GetService(context.Object);

        // Act
        var actual = await service.GetAllTasks();

        // Assert
        CollectionAssert.AreEqual(expected.ToList(), actual.ToList());
    }

    [TestMethod]
    public async Task GetAllTasks_None()
    {
        // Arrange
        IEnumerable<TaskEntity> expected = [];
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([]);

        var service = GetService(context.Object);

        // Act
        var actual = await service.GetAllTasks();

        // Assert
        CollectionAssert.AreEqual(expected.ToList(), actual.ToList());
    }

    [TestMethod]
    public async Task GetTaskById_Invalid()
    {
        // Arrange
        var task1 = new TaskEntity
        {
            Title = "Save A Kitten From A Tree",
            Id = 102
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task1]);
        var service = GetService(context.Object);

        // Act
        var ex = await Assert.ThrowsExceptionAsync<Exception>(() => service.GetTaskById(101));

        // Assert
        Assert.AreEqual("No task with id 101 currently exists.", ex.Message);
    }

    [TestMethod]
    public async Task GetTaskById_Valid()
    {
        // Arrange
        var task1 = new TaskEntity
        {
            Title = "Save A Puppy From A Tree",
            Id = 101
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task1]);
        var service = GetService(context.Object);

        // Act
        var actual = await service.GetTaskById(101);

        // Assert
        Assert.AreEqual(task1, actual);
    }

    [TestMethod]
    public async Task CreateTask_Invalid()
    {
      // Arrange
      var task_insert = new TaskEntity
      {
          Title = "Task With An Id Set",
          Id = 101
      };

      var context = new Mock<IScrumBoardContext>();
      var service = GetService(context.Object);

      // Act
      var ex = await Assert.ThrowsExceptionAsync<Exception>(() => service.CreateTask(task_insert));

      // Assert
      Assert.AreEqual("Tasks should not be created with an id.", ex.Message);
    }

    [TestMethod]
    public async Task CreateTask_Valid()
    {
        // Arrange
        var task_insert = new TaskEntity
        {
            Title = "Task To Be Inserted",
            Description = "This is a task that should be inserted into the database without issue."
        };

        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task_insert]);
        var service = GetService(context.Object);

        // Act
        var actual = await service.CreateTask(task_insert);

        // Assert
        // With a real context/database, the id would be autoincremented when returned
        Assert.AreEqual((HttpStatusCode.Created,0),actual);
    }

    [TestMethod]
    public async Task UpdateTask_Invalid()
    {
        // Arrange
        var task_insert = new TaskEntity
        {
            Title = "Task With An None-Existing Id",
            Id = 101,
            Row = 1,
            Column = 2
        };
        var task_data = new TaskEntity
        {
            Title = "Task With An Existing Id",
            Id = 100,
            Row = 2,
            Column = 2
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task_data]);
        var service = GetService(context.Object);

        // Act
        var ex = await Assert.ThrowsExceptionAsync<Exception>(() => service.UpdateTask(task_insert));

        // Assert
        Assert.AreEqual("No task with id 101 currently exists.", ex.Message);
    }

    [TestMethod]
    public async Task UpdateTask_Valid()
    {
        // Arrange
        var task_insert = new TaskEntity
        {
            Title = "Task With An Updated Position",
            Id = 101,
            Row = 1,
            Column = 2
        };
        var task_data = new TaskEntity
        {
            Title = "Currently Stored Task",
            Id = 101,
            Row = 2,
            Column = 2
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task_data]);
        var service = GetService(context.Object);

        // Act
        var actual = await service.UpdateTask(task_insert);

        // Assert
        Assert.AreEqual(HttpStatusCode.OK, actual);
    }

    [TestMethod]
    public async Task DeleteTask_Invalid()
    {
        // Arrange
        var task1 = new TaskEntity
        {
            Title = "Task With ID 102",
            Id = 102
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task1]);
        var service = GetService(context.Object);

        // Act
        var ex = await Assert.ThrowsExceptionAsync<Exception>(() => service.DeleteTask(101));

        // Assert
        Assert.AreEqual("No task with id 101 currently exists.", ex.Message);
    }

    [TestMethod]
    public async Task DeleteTask_Valid()
    {
        // Arrange
        var task1 = new TaskEntity
        {
            Title = "Task With ID 101",
            Id = 101
        };
        var context = new Mock<IScrumBoardContext>();
        context.Setup(x => x.Tasks).ReturnsDbSet([task1]);
        var service = GetService(context.Object);

        // Act
        var actual = await service.DeleteTask(101);

        // Assert
        Assert.AreEqual(HttpStatusCode.NoContent, actual); 
    }
}
