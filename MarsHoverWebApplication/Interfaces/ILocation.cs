using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarsHoverWebApplication.Interfaces
{
    public interface ILocation
    {
        string CalculateFinalPosition(string input);
    }
}
