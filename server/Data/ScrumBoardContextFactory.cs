using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Scrum_Board_Backend.Data
{
    public class ScrumBoardContextFactory : IDesignTimeDbContextFactory<ScrumBoardContext>
    {
        public ScrumBoardContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ScrumBoardContext>();
            
            // Design-time local DB connection
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=scrumboard_dev;Username=postgres;Password=scRuM.ProJ");

            return new ScrumBoardContext(optionsBuilder.Options);
        }
    }
}
