using MarsRoverWebApplication.Models;
using Microsoft.EntityFrameworkCore;

namespace MarsRoverWebApplication.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
           
        }

        public DbSet<Rover> Rovers { get; set; }
        public DbSet<Location> Locations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {            
                     
        }
    }
}
