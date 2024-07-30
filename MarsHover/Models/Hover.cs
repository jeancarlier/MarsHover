using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarsHover.Models
{
    public class Hover : IHover
    {
        private string[] maxGridSize = new string[2];
        
        public Hover()
        {
            maxGridSize[0] = "";
            maxGridSize[1] = "";
        }

        public string Navigate(string[] input)
        {
            if (input.Length == 0)
                throw new Exception("Input invalid. Send an string array with at least one input. ");

            maxGridSize = input[0].Split(' ');

            if (maxGridSize.Length != 2)
                throw new Exception("First row invalid. The first row might represent the maximun size for the plateau. Ex. \"5 5\"");

            var finalHoversPosition = "";

            //Loop through all inputs after setting grid size
            for (int i = 1; i < input.Length - 1; i++)
            {
                //Get initial position for current hover
                var initialPosition = input[i].Split(' ');

                if (initialPosition.Length != 3)
                    throw new Exception("Invalid initial postion string for hover number " + i);

                Location hoverLocation = new Location(initialPosition);

                //Navigate hover acoording to string of commands (L turn 90 degrees left; R turn 90 degrees right; M move forward )
                finalHoversPosition += hoverLocation.Navigate(input[i]);

                //Go to next hover if exists
                i++;
            }

            return finalHoversPosition;
        }
    
    }
}