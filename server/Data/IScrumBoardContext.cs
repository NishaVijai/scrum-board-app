using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Models;

namespace Scrum_Board_Backend.Data
{
    public interface IScrumBoardContext
    {
        DbSet<TaskEntity> Tasks { get; set; }
        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
