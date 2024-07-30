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
               
    }
}