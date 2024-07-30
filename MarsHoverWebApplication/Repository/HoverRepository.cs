using MarsHoverWebApplication.Data;
using MarsHoverWebApplication.Interfaces;
using MarsHoverWebApplication.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MarsHoverWebApplication.Repository
{
    public class HoverRepository : IHoverRepository
    {
        private readonly DataContext _context;

        public HoverRepository(DataContext context)
        {
            _context = context;
        }

        public ICollection<Hover> GetHovers()
        {
            return _context.Hovers.Include(c => c.Locations).OrderBy(i => i.Id).ThenBy(h => h.Locations.Min(d => d.MovimentTime)).ToList<Hover>();
        }

        public bool CreateHoverNavigation(Hover hover)
        {
            if (hover.Color is null)
            {
                Random rand = new Random();
                hover.Color = "rgba(" + rand.Next(0,255) + "," + rand.Next(0, 255) + "," + rand.Next(0, 255) + ", 1)";
            }
            _context.Add(hover);
            return Save();
        }

        public bool Save()
        {
            var saved = _context.SaveChanges();
            return saved > 0 ? true : false;
        }
    }
}
