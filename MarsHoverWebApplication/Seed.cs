using MarsRoverWebApplication.Data;
using MarsRoverWebApplication.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MarsRoverWebApplication
{
    public class Seed
    {
        private readonly DataContext dataContext;

        public Seed(DataContext context)
        {
            this.dataContext = context;
        }

        public void SeedDataContext() 
        {
            Console.WriteLine("Seeding data");
            if (!dataContext.Rovers.Any())
            {
                Console.WriteLine("Nothing in the table!");
                var rovers = new List<Rover>() {
                    new Rover()
                    {
                        Color = "rgba(252,90,10,1)",
                        Locations = new List<Location>(){ 
                            new Location(){ 
                                MaxGridSize = new string[]{ "5","5" },
                                X = 2,
                                Y = 2,
                                HeadingTo = Location.HeadTo.N,
                                NavigationSteps = "",
                                MovimentTime = DateTime.Now
                            },
                            new Location(){
                                MaxGridSize = new string[]{ "5","5" },
                                X = 5,
                                Y = 3,
                                HeadingTo = Location.HeadTo.E,
                                NavigationSteps = "MRMMM",
                                MovimentTime = DateTime.Now.AddSeconds(15)
                            }
                        }
                    },
                    new Rover()
                    {
                        Color = "rgba(10,252,10,1)",
                        Locations = new List<Location>(){
                            new Location(){
                                MaxGridSize = new string[]{ "10","10" },
                                X = 3,
                                Y = 3,
                                HeadingTo = Location.HeadTo.E,
                                NavigationSteps = "",                                
                                MovimentTime = DateTime.Now.AddSeconds(20)
                            },
                            new Location(){
                                MaxGridSize = new string[]{ "10","10" },
                                X = 5,
                                Y = 1,
                                HeadingTo = Location.HeadTo.E,
                                NavigationSteps = "MMRMMRMRRM",
                                MovimentTime = DateTime.Now.AddSeconds(40)
                            }
                        }
                    }
                };
                dataContext.Rovers.AddRange(rovers);
                dataContext.SaveChanges();
            }
        }
    }
}
