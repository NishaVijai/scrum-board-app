using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Data
{
    public class ScrumBoardContext : DbContext, IScrumBoardContext
    {
        public ScrumBoardContext(DbContextOptions<ScrumBoardContext> options)
            : base(options)
        {
        }

        public DbSet<TaskEntity> Tasks { get; set; } = null!;
    }
}
