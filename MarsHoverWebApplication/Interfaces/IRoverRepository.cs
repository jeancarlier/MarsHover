using MarsRoverWebApplication.Models;
using System.Collections;
using System.Collections.Generic;

namespace MarsRoverWebApplication.Interfaces
{
    public interface IRoverRepository
    {
        ICollection<Rover> GetRovers();
        bool CreateRoverNavigation(Rover rover);        
    }
}
