using MarsHoverWebApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace MarsHoverWebApplication.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
           
        }

        public DbSet<Hover> Hovers { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {            
                     
        }
    }
}
