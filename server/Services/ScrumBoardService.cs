using Scrum_Board_Backend.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Scrum_Board_Backend.Services
{
    public class ScrumBoardService : IScrumBoardService
    {
        private readonly IMongoCollection<TaskEntity> _tasks;

        public ScrumBoardService()
        {
            var connectionString = Environment.GetEnvironmentVariable("MongoDbSettings__ConnectionString");
            var databaseName = Environment.GetEnvironmentVariable("MongoDbSettings__DatabaseName");

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentException("MongoDB connection string is missing.");

            if (string.IsNullOrEmpty(databaseName))
                throw new ArgumentException("MongoDB database name is missing.");

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _tasks = database.GetCollection<TaskEntity>("Tasks");
        }

        // --------------------
        // Get all tasks
        // --------------------
        public async Task<List<TaskEntity>> GetAllTasksAsync()
        {
            return await _tasks.Find(_ => true).ToListAsync();
        }

        // --------------------
        // Get task by ID (SAFE)
        // --------------------
        public async Task<TaskEntity?> GetTaskByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return null;

            return await _tasks
                .Find(task => task.Id == id)
                .FirstOrDefaultAsync();
        }

        // --------------------
        // Add a new task
        // --------------------
        public async Task<TaskEntity> AddTaskAsync(TaskEntity task)
        {
            await _tasks.InsertOneAsync(task);
            return task;
        }

        // --------------------
        // Update an existing task (SAFE)
        // --------------------
        public async Task<bool> UpdateTaskAsync(TaskEntity task)
        {
            if (!ObjectId.TryParse(task.Id, out _))
                return false;

            var result = await _tasks.ReplaceOneAsync(
                t => t.Id == task.Id,
                task
            );

            return result.IsAcknowledged && result.MatchedCount > 0;
        }

        // --------------------
        // Delete a task (SAFE)
        // --------------------
        public async Task<bool> DeleteTaskAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return false;

            var result = await _tasks.DeleteOneAsync(t => t.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }
    }
}
