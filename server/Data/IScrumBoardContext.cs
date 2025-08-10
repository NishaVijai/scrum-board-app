using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Data
{
    public interface IScrumBoardContext
    {
        public DbSet<TaskEntity> Tasks { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
