using MarsHover.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace MarsHover
{
    /// <summary>
    /// Summary description for MarsHoverService
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class MarsHoverService : System.Web.Services.WebService
    {

        [WebMethod (MessageName = "Navigate hovers by string input.")]
        public string Navigate(string[] input)
        {
            Hover hover = new Hover();
            return hover.Navigate(input);
        }
    }
}
