using MarsRoverWebApplication.Interfaces;
using MarsRoverWebApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace MarsRoverWebApplication.Controllers
{
    [ApiController]
    [Route("rover")]
    public class RoverController : Controller
    {
        private readonly IRoverRepository _roverRepository;
        public RoverController(IRoverRepository roverRepository)
        {
            this._roverRepository = roverRepository;
        }

        [HttpGet("History")]
        public IActionResult History()
        {
            var roverList = _roverRepository.GetRovers();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return View(roverList);
        }


        [HttpGet]        
        public string Navigate(string navScript)
        {
            try
            {
                if (navScript is null)
                    return "";

                var inputArray = navScript.Split(";");

                if (inputArray.Length == 0)
                    throw new Exception("Input invalid. Send an string array with at least one input. ");

                var maxGridSize = inputArray[0].Split(' ');

                if (maxGridSize.Length != 2)
                    throw new Exception("First row invalid. The first row might represent the maximun size for the plateau. Ex. \"5 5\"");

                var finalPosition = "";
                
                //Loop through all inputs after setting grid size
                for (int i = 1; i < inputArray.Length - 1; i++)
                {
                    //Get initial position for current rover
                    var initialPosition = inputArray[i].Split(' ');

                    if (initialPosition.Length != 3)
                        throw new Exception("Invalid initial position string for rover number " + i);

                    Rover rover = new Rover();
                    var roverNavigationArray = new string[] { inputArray[i], inputArray[i + 1] };
                    finalPosition += (string.IsNullOrEmpty(finalPosition) ? "" : " ") + rover.Navigate(roverNavigationArray, maxGridSize);
                    i++;
                    _roverRepository.CreateRoverNavigation(rover);                    
                }
                
                if (!ModelState.IsValid)
                    return "";

                return finalPosition;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

    }
}
