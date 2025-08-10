using System.Net;
using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Services
{
    public class ScrumBoardService(IScrumBoardContext context) : IScrumBoardService
    {
        public async Task<(HttpStatusCode, int)> CreateTask(TaskEntity entity)
        {
            if (entity.Id != 0)
            {
                 throw new Exception("Tasks should not be created with an id.");
            }

            context.Tasks.Add(entity);
            await context.SaveChangesAsync();
            return (HttpStatusCode.Created, entity.Id);
        }

        public async Task<HttpStatusCode> DeleteTask(int id)
        {
            var entity = await context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

            if (entity == null)
            {
                throw new Exception("No task with id " + id + " currently exists.");
            }

            context.Tasks.Remove(entity);
            await context.SaveChangesAsync();
            return HttpStatusCode.NoContent;
        }

        public async Task<IEnumerable<TaskEntity>> GetAllTasks()
        {
            return await context.Tasks.ToArrayAsync();
        }

        public async Task<TaskEntity> GetTaskById(int id)
        {
            var entity = await context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

            if (entity == null)
            {
                throw new Exception("No task with id " + id + " currently exists.");
            }

            return entity;
        }

        public async Task<HttpStatusCode> UpdateTask(TaskEntity task)
        {
            var entity = await context.Tasks.FirstOrDefaultAsync(t => t.Id == task.Id);

            if (entity == null)
            {
                throw new Exception("No task with id " + task.Id + " currently exists.");
            }

            entity.Title = task.Title;
            entity.Description = task.Description;
            entity.Column = task.Column;
            entity.Row = task.Row;

            await context.SaveChangesAsync();
            return HttpStatusCode.OK;
        }
    }
}
