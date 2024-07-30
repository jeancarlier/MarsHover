using MarsRoverWebApplication.Data;
using MarsRoverWebApplication.Interfaces;
using MarsRoverWebApplication.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MarsRoverWebApplication.Repository
{
    public class RoverRepository : IRoverRepository
    {
        private readonly DataContext _context;

        public RoverRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Rover> GetRovers()
        {
            return _context.Rovers.Include(c => c.Locations).OrderBy(i => i.Id).ThenBy(h => h.Locations.Min(d => d.MovimentTime)).ToList<Rover>();
        }

        public bool CreateRoverNavigation(Rover rover)
        {
            if (rover.Color is null)
            {
                Random rand = new Random();
                rover.Color = "rgba(" + rand.Next(0,255) + "," + rand.Next(0, 255) + "," + rand.Next(0, 255) + ", 1)";
            }
            _context.Add(rover);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
