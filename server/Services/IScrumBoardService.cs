using System.Net;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Services
{
    public interface IScrumBoardService
    {
        public Task<IEnumerable<TaskEntity>> GetAllTasks();

        public Task<TaskEntity> GetTaskById(int id);

        public Task<(HttpStatusCode, int)> CreateTask(TaskEntity entity);

        public Task<HttpStatusCode> UpdateTask(TaskEntity entity);

        public Task<HttpStatusCode> DeleteTask(int id);
    }
}
