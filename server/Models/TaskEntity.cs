using System.ComponentModel.DataAnnotations;

namespace Scrum_Board_Backend.Models
{
    public class TaskEntity
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string? Description { get; set; }

        public int Column {  get; set; }

        public int Row { get; set; }
    }
}
