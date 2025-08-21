using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Services
{
    public class ScrumBoardService : IScrumBoardService
    {
        private readonly IScrumBoardContext _context;

        public ScrumBoardService(IScrumBoardContext context)
        {
            _context = context;
        }

        public async Task<List<TaskEntity>> GetAllTasksAsync()
        {
            return await _context.Tasks.ToListAsync();
        }

        public async Task<TaskEntity?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<TaskEntity> AddTaskAsync(TaskEntity task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateTaskAsync(TaskEntity task)
        {
            _context.Tasks.Update(task);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;
            _context.Tasks.Remove(task);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
