using MarsRoverWebApplication.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MarsRoverWebApplication.Models
{
    public class Rover : IRover
    {
        public int Id { get; set; }

        public string Color { get; set; }

        public ICollection<Location> Locations{ get; set; }

        public string Navigate(string[] input, string[] maxGridSize)
        {
            if (input.Length == 0)
                throw new Exception("Input invalid. Send an string array with at least one input. ");
           
            var finalRoversPosition = "";

            //Get initial position for current rover
            var initialPosition = input[0].Split(' ');
            var movements = input[1];

            if (initialPosition.Length != 3)
                throw new Exception("Invalid initial position string for the rover!");

            if (this.Locations == null)
                this.Locations = new List<Location>();
                        
            //Add initial location to database
            Location initialRoverLocation = new Location(initialPosition);
            initialRoverLocation.MaxGridSize = maxGridSize;
            initialRoverLocation.MovimentTime = DateTime.Now;
            initialRoverLocation.X = int.Parse(initialPosition[0]);
            initialRoverLocation.Y = int.Parse(initialPosition[1]);
            initialRoverLocation.HeadingTo = (Location.HeadTo)Enum.Parse(typeof(Location.HeadTo), initialPosition[2]);

            this.Locations.Add(initialRoverLocation);

            //Add final position of the rover
            Location finalRoverLocation = new Location(initialPosition);
            finalRoverLocation.MaxGridSize = maxGridSize;
            finalRoverLocation.MovimentTime = DateTime.Now.AddSeconds(10);
            finalRoverLocation.NavigationSteps = movements;

            //Navigate rover acoording to string of commands (L turn 90 degrees left; R turn 90 degrees right; M move forward )               
            finalRoversPosition += finalRoverLocation.CalculateFinalPosition(movements) + " ";
                
            this.Locations.Add(finalRoverLocation);

            return finalRoversPosition.Trim();
        }
               
    }
}