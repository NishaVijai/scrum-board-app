using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Scrum_Board_Backend.Models
{
    public class TaskEntity
    {
        [BsonId]  // Marks as MongoDB primary key
        [BsonRepresentation(BsonType.ObjectId)] // Let Mongo store as ObjectId
        public string Id { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int Column { get; set; }  // e.g., 0=Todo,1=InProgress,2=Done

        public int Row { get; set; }     // Order of the task in the column
    }
}
