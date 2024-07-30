using MarsHoverWebApplication.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MarsHoverWebApplication.Models
{
    public class Hover : IHover
    {
        public int Id { get; set; }

        public string Color { get; set; }

        public ICollection<Location> Locations{ get; set; }

        public string Navigate(string[] input, string[] maxGridSize)
        {
            if (input.Length == 0)
                throw new Exception("Input invalid. Send an string array with at least one input. ");
           
            var finalHoversPosition = "";

            //Get initial position for current hover
            var initialPosition = input[0].Split(' ');
            var movements = input[1];

            if (initialPosition.Length != 3)
                throw new Exception("Invalid initial position string for the hover!");

            if (this.Locations == null)
                this.Locations = new List<Location>();
                        
            //Add initial location to database
            Location initialHoverLocation = new Location(initialPosition);
            initialHoverLocation.MaxGridSize = maxGridSize;
            initialHoverLocation.MovimentTime = DateTime.Now;
            initialHoverLocation.X = int.Parse(initialPosition[0]);
            initialHoverLocation.Y = int.Parse(initialPosition[1]);
            initialHoverLocation.HeadingTo = (Location.HeadTo)Enum.Parse(typeof(Location.HeadTo), initialPosition[2]);

            this.Locations.Add(initialHoverLocation);

            //Add final position of the hover
            Location finalHoverLocation = new Location(initialPosition);
            finalHoverLocation.MaxGridSize = maxGridSize;
            finalHoverLocation.MovimentTime = DateTime.Now.AddSeconds(10);
            finalHoverLocation.NavigationSteps = movements;

            //Navigate hover acoording to string of commands (L turn 90 degrees left; R turn 90 degrees right; M move forward )               
            finalHoversPosition += finalHoverLocation.CalculateFinalPosition(movements) + " ";
                
            this.Locations.Add(finalHoverLocation);

            return finalHoversPosition.Trim();
        }

        /*public string Navigate(string[] input)
        {
            if (input.Length == 0)
                throw new Exception("Input invalid. Send an string array with at least one input. ");

            var maxGridSize = input[0].Split(' ');

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

                if (this.Locations == null)
                    this.Locations = new List<Location>();

                //Add initial location to database
                Location initialHoverLocation = new Location(initialPosition);
                initialHoverLocation.MaxGridSize = maxGridSize;
                initialHoverLocation.MovimentTime = DateTime.Now;
                initialHoverLocation.X = int.Parse(initialPosition[0]);
                initialHoverLocation.Y = int.Parse(initialPosition[1]);
                initialHoverLocation.HeadingTo = (Location.HeadTo)Enum.Parse(typeof(Location.HeadTo), initialPosition[2]);

                this.Locations.Add(initialHoverLocation);

                //Add
                Location hoverLocation = new Location(initialPosition);
                hoverLocation.MaxGridSize = maxGridSize;
                hoverLocation.MovimentTime = DateTime.Now.AddSeconds(10);

                //Navigate hover acoording to string of commands (L turn 90 degrees left; R turn 90 degrees right; M move forward )
                i++;
                hoverLocation.NavigationSteps = input[i];
                finalHoversPosition += hoverLocation.CalculatePosition(input[i]) + " ";

                //if navigation is blank return empty string
                //if (input[i] == "")
                //    finalHoversPosition = "";



                this.Locations.Add(hoverLocation);
            }

            return finalHoversPosition.Trim();
        }*/
    }
}