using MarsHoverWebApplication.Interfaces;
using MarsHoverWebApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace MarsHoverWebApplication.Controllers
{
    [ApiController]
    [Route("hover")]
    public class HoverController : Controller
    {
        private readonly IHoverRepository _hoverRepository;
        public HoverController(IHoverRepository hoverRepository)
        {
            this._hoverRepository = hoverRepository;
        }

        [HttpGet("History")]
        public IActionResult History()
        {
            var hoverList = _hoverRepository.GetHovers();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return View(hoverList);
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
                    //Get initial position for current hover
                    var initialPosition = inputArray[i].Split(' ');

                    if (initialPosition.Length != 3)
                        throw new Exception("Invalid initial position string for hover number " + i);

                    Hover hover = new Hover();
                    var hoverNavigationArray = new string[] { inputArray[i], inputArray[i + 1] };
                    finalPosition += (string.IsNullOrEmpty(finalPosition) ? "" : " ") + hover.Navigate(hoverNavigationArray, maxGridSize);
                    i++;
                    _hoverRepository.CreateHoverNavigation(hover);                    
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
