using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarsRoverWebApplication.Interfaces
{
    interface IRover
    {
        string Navigate(string[] input, string[] maxGridSize);
    }
}
