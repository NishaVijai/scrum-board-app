using MongoDB.Driver;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Data
{
    public interface IScrumBoardContext
    {
        IMongoCollection<TaskEntity> Tasks { get; }
    }
}
