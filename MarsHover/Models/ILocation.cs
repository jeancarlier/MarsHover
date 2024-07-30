using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarsHover.Models
{
    public interface ILocation
    {
        string Navigate(string input);
    }
}
