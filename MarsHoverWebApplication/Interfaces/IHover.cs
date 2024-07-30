using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarsHoverWebApplication.Interfaces
{
    interface IHover
    {
        string Navigate(string[] input, string[] maxGridSize);
    }
}
