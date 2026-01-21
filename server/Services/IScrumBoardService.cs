using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Services
{
    public interface IScrumBoardService
    {
        Task<List<TaskEntity>> GetAllTasksAsync();
        Task<TaskEntity?> GetTaskByIdAsync(string id);
        Task<TaskEntity> AddTaskAsync(TaskEntity task);
        Task<bool> UpdateTaskAsync(TaskEntity task);
        Task<bool> DeleteTaskAsync(string id);
    }
}
