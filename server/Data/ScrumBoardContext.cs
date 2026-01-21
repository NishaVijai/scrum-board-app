using MongoDB.Driver;
using Scrum_Board_Backend.Models;
using System;

namespace Scrum_Board_Backend.Data
{
    public class ScrumBoardContext : IScrumBoardContext
    {
        public IMongoCollection<TaskEntity> Tasks { get; }

        public ScrumBoardContext()
        {
            // Read MongoDB settings from environment variables
            var connectionString = Environment.GetEnvironmentVariable("MongoDbSettings__ConnectionString");
            var databaseName = Environment.GetEnvironmentVariable("MongoDbSettings__DatabaseName");

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentException("MongoDB connection string is missing. Set it in .env or environment variables.");

            if (string.IsNullOrEmpty(databaseName))
                throw new ArgumentException("MongoDB database name is missing. Set it in .env or environment variables.");

            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);

            Tasks = database.GetCollection<TaskEntity>("Tasks");
        }
    }
}
