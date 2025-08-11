using Microsoft.AspNetCore.Mvc;
using Moq;
using Scrum_Board_Backend.Services;
using System.Net;
using Scrum_Board_Backend.Controllers;
using Scrum_Board_Backend.Models;

namespace ScrumBoardBackend.Test
{
    [TestClass]
    public class ScrumBoardControllerTests
    {
        private static ScrumBoardController GetController(Mock<IScrumBoardService> scrumBoardService) =>
            new(scrumBoardService.Object);
        
       [TestMethod]
        public async Task GetAllTasks()
        {
            // Arrange
            var scrumBoardService = new Mock<IScrumBoardService>(MockBehavior.Strict);
            scrumBoardService.Setup(x => x.GetAllTasks())
                .ReturnsAsync([]); // Doesn't matter.

            var controller = GetController(scrumBoardService);

            // Act
            var actual = await controller.GetAllTasks();

            // Assert
            Assert.IsInstanceOfType<OkObjectResult>(actual);
            scrumBoardService.VerifyAll();
        }

        [TestMethod]
        public async Task GetTask()
        {
            // Arrange
            int id = 101;
            var scrumBoardService = new Mock<IScrumBoardService>(MockBehavior.Strict);
            scrumBoardService.Setup(x => x.GetTaskById(id))
                .ReturnsAsync(new TaskEntity()); // Doesn't matter.

            var controller = GetController(scrumBoardService);

            // Act
            var actual = await controller.GetTask(id);

            // Assert
            Assert.IsInstanceOfType<OkObjectResult>(actual);
            scrumBoardService.VerifyAll();
        }

        [TestMethod]
        public async Task CreateTask()
        {
            // Arrange
            TaskEntity entity = new TaskEntity();
            var scrumBoardService = new Mock<IScrumBoardService>(MockBehavior.Strict);
            scrumBoardService.Setup(x => x.CreateTask(entity))
                .ReturnsAsync((HttpStatusCode.Created,101)); // Doesn't matter.

            var controller = GetController(scrumBoardService);

            // Act
            var actual = await controller.CreateTask(entity);

            // Assert
            Assert.IsInstanceOfType<OkObjectResult>(actual);
            scrumBoardService.VerifyAll();
        }

        [TestMethod]
        public async Task UpdateTask()
        {
            // Arrange
            TaskEntity entity = new TaskEntity();
            var scrumBoardService = new Mock<IScrumBoardService>(MockBehavior.Strict);
            scrumBoardService.Setup(x => x.UpdateTask(entity))
                .ReturnsAsync(HttpStatusCode.OK); // Doesn't matter.

            var controller = GetController(scrumBoardService);

            // Act
            var actual = await controller.UpdateTask(entity);

            // Assert
            Assert.IsInstanceOfType<OkObjectResult>(actual);
            scrumBoardService.VerifyAll();
        }

        [TestMethod]
        public async Task DeleteTask()
        {
            // Arrange
            int id = 101;
            var scrumBoardService = new Mock<IScrumBoardService>(MockBehavior.Strict);
            scrumBoardService.Setup(x => x.DeleteTask(id))
                .ReturnsAsync(HttpStatusCode.NoContent); // Doesn't matter.

            var controller = GetController(scrumBoardService);

            // Act
            var actual = await controller.DeleteTask(id);

            // Assert
            Assert.IsInstanceOfType<OkObjectResult>(actual);
            scrumBoardService.VerifyAll();
        }

    }
}
