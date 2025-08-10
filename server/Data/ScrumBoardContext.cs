using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Data
{
    public class ScrumBoardContext : DbContext, IScrumBoardContext
    {
        public DbSet<TaskEntity> Tasks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=scrumboarddb.db");
        }
    }
}
