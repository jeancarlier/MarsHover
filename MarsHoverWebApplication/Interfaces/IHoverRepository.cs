using MarsHoverWebApplication.Models;
using System.Collections;
using System.Collections.Generic;

namespace MarsHoverWebApplication.Interfaces
{
    public interface IHoverRepository
    {
        ICollection<Hover> GetHovers();
        bool CreateHoverNavigation(Hover hover);
        bool UpdateHoverNavigation(Hover hover);
    }
}
