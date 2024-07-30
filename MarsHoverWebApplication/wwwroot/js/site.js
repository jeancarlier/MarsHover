var roverList = [];
var legendList = [];
var roverStatus = ""; //Possible values are: Created, LandPending, Saved

/**
 * Add a new rover to the grid
 *
 */
function addRover() {
    var navScript = document.getElementById('navScript');
    var startPosX = document.getElementById('startPosX');
    var startPosY = document.getElementById('startPosY');
    var gridSizeX = document.getElementById('gridSizeX');
    var gridSizeY = document.getElementById('gridSizeY');
    var roverNavScript = document.getElementById('roverNavScript');
    var startOrientation = document.getElementById('startOrientation');
    var old = navScript.value;

    if (gridSizeX.value <= 1 || gridSizeY.value <= 1 || gridSizeX.value == "" || gridSizeY.value == "") {
        alert("The grid size may be greater then 1. ");
        return;
    }

    if (startPosX.value == "") {
        alert("Please set the initial position X before adding a rover!");
        return;
    }

    if (startPosY.value == "") {
        alert("Please set the initial position Y before adding a rover!");
        return;
    }

    if (startOrientation.value == "") {
        alert("Please select the initial orientation before adding a rover!");
        return;
    }

    if (roverStatus == "LandPending") {
        alert("Please land the current rover before adding a new one!");
        return;
    }

    if (roverStatus == "Created") {
        alert("Please add a navigation to the current rover and land it before adding a new one!");
        return;
    }

    if (roverStatus == "Saved") {
        drawGrid();
        clearLegend();
        roverStatus = "";
    }

    //If it is the first rover
    if (old == "") {
        old = gridSizeX.value + " " + gridSizeY.value +";"        
    }

    navScript.value = old + startPosX.value + " " +
        startPosY.value + " " +
        startOrientation.value + ";" +
        roverNavScript.value +
        (roverNavScript.value != "" ? ";" : "");

    var color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',1)';
    drawRover(startPosX.value, startPosY.value, gridSizeY.value, gridSizeX.value, startOrientation.value, color, true, false);
   
    var legendDesc = startPosX.value + " " + startPosY.value + " " +
                        startOrientation.value + " - " +
                        roverNavScript.value ;
    addLegend(color, legendDesc);

    //Clear only if it has navigation defined
    if (roverNavScript.value != "") {
        navigate(false);

        startPosX.value = "";
        startPosY.value = "";
        roverNavScript.value = "";
    } else
    {
        roverStatus = "Created"
    }
            
}

/**
 * Acumulate navigations to the current rover
 * 
 * @param {any} direction M = move forward, L = rotate to left, R = rotate to right
 */
function addNavigation(direction) { 
    var roverNavScript = document.getElementById('roverNavScript');   
    var gridSizeX = document.getElementById('gridSizeX');
    var gridSizeY = document.getElementById('gridSizeY');

    roverNavScript.value += direction; 

    var lastRover = roverList[roverList.length - 1];
    let lastRoverX = lastRover.x;
    let lastRoverY = lastRover.y;
    let lastRoverOrientation = lastRover.orientation;
    
    switch (direction) {

        case "L":
        case "R":
            changeDirection(lastRover, direction);
            clearRover(lastRoverX, lastRoverY, gridSizeY.value, gridSizeX.value);
            break;        
        case "M":
            moveForward(lastRover);
            clearRover(lastRoverX, lastRoverY, gridSizeY.value, gridSizeX.value, lastRoverOrientation);                        
            break;
    }
        
    drawRover(lastRover.x, lastRover.y, gridSizeY.value, gridSizeX.value, lastRover.orientation, lastRover.color, false, false);

    //Draw the start position if it is the first movement
    if (roverNavScript.value.length == 1 && direction == "M") {
        drawRover(lastRoverX, lastRoverY, gridSizeY.value, gridSizeX.value, lastRoverOrientation, lastRover.color, false, true);
    }
    
    roverStatus = "LandPending"
}

/**
 * Change direction of a rover using a rotation L (rotate to the left) and R (Rotate to the right)
 * Depending on the current orientation
 * @param {any} rover 
 * @param {any} rotation
 */
function changeDirection(rover, rotation) {
    switch (rover.orientation) {

        case "N":
            rotation == "L" ? rover.orientation = "W" : rover.orientation = "E";
            break;
        case "S":
            rotation == "L" ? rover.orientation = "E" : rover.orientation = "W";
            break;
        case "E":
            rotation == "L" ? rover.orientation = "N" : rover.orientation = "S";
            break;
        case "W":
            rotation == "L" ? rover.orientation = "S" : rover.orientation = "N";
            break;

    }
}

/**
 * Move rover forward according to it's orientation
 * @param {any} rover
 */
function moveForward(rover) {

    switch (rover.orientation) {

        case "N":
            rover.y = parseInt(rover.y) - 1;
            break;
        case "S":
            rover.y = parseInt(rover.y) + 1;
            break;
        case "E":
            rover.x = parseInt(rover.x) + 1;
            break;
        case "W":
            rover.x = parseInt(rover.x) - 1;
            break;

    }
}

/**
 * Attach navigation script to the current rover
 */
function addNavigationToRover()
{
    let navScript = document.getElementById('navScript');
    let roverNavScript = document.getElementById('roverNavScript');
    let startPosX = document.getElementById('startPosX');
    let startPosY = document.getElementById('startPosY');

    if (startPosX.value == "" || startPosY.value == "") {
        alert("First you need to add a rover to be controlled!");
        return;
    }
    
    if (roverNavScript.value == "") {
        alert("Please create a navigation for the rover before landing it!");
        return;
    }

    navScript.value = navScript.value.substring(0, navScript.value.length - 1);
    navScript.value += ";" + roverNavScript.value + ";";
    appendToLegend(roverNavScript.value, legendList.length - 1);
    
    startPosX.value = "";
    startPosY.value = "";
    roverNavScript.value = "";
    roverStatus = "";
}

/**
 * Draws the grid in a canvas according to the current setting of rows and columns
 *  
 */
function drawGrid()
{
    let gridSizeX = document.getElementById('gridSizeX');
    let gridSizeY = document.getElementById('gridSizeY');

    if (gridSizeX == null)
        return;

    let rows = gridSizeY.value == "" ? 5 : gridSizeY.value;
    let columns = gridSizeX.value == "" ? 5 : gridSizeX.value;

    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let colSize = (width / columns);
    let rowSize = (height / rows);
    let currentX = 0;
    let currentY = 0;
            
    ctx.clearRect(0, 0, width, height);

    //Draw column bars
    for(i = 0; i <= columns; i++)
    { 
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.fillStyle = `rgba(255,99,71,1)`;
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX, currentX + height);
        ctx.stroke();
        currentX += colSize;
    }

    currentX = 0;
    currentY = 0;

    //Draw rows
    for (i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.fillStyle = `rgba(255,99,71,1)`;
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentY + width, currentY);
        ctx.stroke();
        currentY += rowSize;
    }

    onXChange();
    onYChange();
}

/**
 * Clear last plotted rover
 * @param {any} x
 * @param {any} y
 * @param {any} rows
 * @param {any} columns
 * @param {any} isRotation
 */
function clearRover(x, y, rows, columns, isRotation) {

    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
        
    let posX = (width / columns) * x;
    let posY = (height / rows) * y;

    let bottomLegColor = "black";
    let upperLegColor = "black";
    let leftLegColor = "black";
    let rightLegColor = "black";
    
    //Clear rect
    ctx.clearRect(posX - 10, posY - 10, 20, 20);   
    
    //Draw upper leg
    ctx.beginPath();
    ctx.strokeStyle = upperLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX, posY - 20);
    ctx.stroke();

    //Draw bottom leg
    ctx.beginPath();
    ctx.strokeStyle = bottomLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX, posY + 20);
    ctx.stroke();

    //Draw left leg
    ctx.beginPath();
    ctx.strokeStyle = leftLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX - 20, posY);
    ctx.stroke();

    //Draw right leg
    ctx.beginPath();
    ctx.strokeStyle = rightLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX + 20, posY);
    ctx.stroke();

}

/**
 * Draw a rover in a defined postion in the grid
 * @param {any} x
 * @param {any} y
 * @param {any} rows
 * @param {any} columns
 * @param {any} orientation
 * @param {any} color
 * @param {any} reverse
 */
function drawRover(x,y,rows,columns, orientation, color, reverse, isStartPosition) {

    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
        
    //reverse y to be bottom-top referenced
    if (reverse) {
        let gridSizeY = document.getElementById('gridSizeY');
        y = gridSizeY.value - y;
    }

    let posX = (width / columns) * x;
    let posY = (height / rows) * y;
            
    //Draw rover body
    ctx.beginPath();
    ctx.fillStyle = color;            
    ctx.ellipse(posX, posY, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
            
    ctx.fill();

    //Draw orientation arrow only if it is the current rover
    if (!isStartPosition) {
        ctx.beginPath();

        switch (orientation) {
            case "N":
                ctx.moveTo(posX - 10, posY);
                ctx.lineTo(posX + 10, posY);
                ctx.lineTo(posX + 2 / 2, posY - 20);
                break;
            case "S":
                ctx.moveTo(posX - 10, posY);
                ctx.lineTo(posX + 10, posY);
                ctx.lineTo(posX + 2 / 2, posY + 20);
                break;
            case "W":
                ctx.moveTo(posX, posY - 10);
                ctx.lineTo(posX, posY + 10);
                ctx.lineTo(posX + 20 * -1, posY + 2 / 2);
                break;
            case "E":
                ctx.moveTo(posX, posY - 10);
                ctx.lineTo(posX, posY + 10);
                ctx.lineTo(posX + 20, posY + 2 / 2);
                break;
        }

        ctx.fill();


        var rover = {
            x: x,
            y: y,
            orientation: orientation,
            color: color,
            order: legendList.length
        };

        roverList = roverList.filter(i => i.color !== color);
        roverList.push(rover);
        roverList.sort(h => h.order);
    }
}

/**
 * Clear rover legends
 */
function clearLegend() {
    document.getElementById('legendBoxContainer').remove();
    legendList = [];
}

/**
 * Add a legend with a specified color and description
 * @param {any} color
 * @param {any} navigationScript
 */
function addLegend(color, navigationScript) {
    var container = document.getElementById('legend');            
    var boxContainer = document.createElement("DIV");
    boxContainer.id = "legendBoxContainer";
    var box = document.createElement("DIV");
    box.id = "legendBox" + legendList.length;
    var label = document.createElement("SPAN");

    label.innerHTML = navigationScript;
    label.margin = '0,0,0,5';
    label.id = "legendLabel" + legendList.length;
    box.className = "box";
    box.style.backgroundColor = color;
    
    boxContainer.appendChild(box);
    boxContainer.appendChild(label);

    container.appendChild(boxContainer);      

    legendList.push(container);
}

/**
 * Add text to a defined legend index
 * @param {any} description
 * @param {any} index
 */
function appendToLegend(description, index)
{
    label = document.getElementById("legendLabel" + index);
    if (label != null) {
        label.firstChild.nodeValue += description;
    }
}

/**
 * Saves the defined script to database calling the web API. 
 * @param {any} clearFinalScript
 */
function navigate(clearFinalScript) {

    //redraw grid
    drawGrid();

    var input = document.getElementById('navScript');

    const apiUrl = 'https://localhost:44394/rover?navScript=' + input.value;
    
    fetch(apiUrl, { mode: 'no-cors' })
        .then(request => {
            return request.text();
        })
        .then(data => {
            console.log(data);

            if (data == "")
                return;

            let gridSizeX = document.getElementById('gridSizeX');
            let gridSizeY = document.getElementById('gridSizeY');
            
            let rows = gridSizeY.value == "" ? 5 : gridSizeY.value;
            let columns = gridSizeX.value == "" ? 5 : gridSizeX.value;

            let index = 0;
            let roverIndex = 0;
            let x = "";
            let y = "";

            for (i = 0; i < data.length; i++) {

                if (data[i] == " ")
                    continue;

                if (index == 2) {                                        
                    var legendColor = document.getElementById("legendBox" + roverIndex);
                    var color = legendColor.style.backgroundColor;                 
                    drawRover(x, y, rows, columns, data[i], color, true, false);
                    x = "";
                    y = "";
                    roverIndex++;
                    index = -1;
                } else if (index == 1 && y == "") {
                    y = data[i];
                } else if (index == 0 && x == "") {
                    x = data[i];
                }
                
                index++;
            }

            if (clearFinalScript) {
                let navScript = document.getElementById('navScript');
                navScript.value = "";
                roverList = [];
                legendList = [];
                roverStatus = "Saved"
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**Reset form to original status*/
function resetNavigation() {
    let navScript = document.getElementById('navScript');
    let startPosX = document.getElementById('startPosX');
    let startPosY = document.getElementById('startPosY');
    var gridSizeX = document.getElementById('gridSizeX');
    var gridSizeY = document.getElementById('gridSizeY');
    let roverNavScript = document.getElementById('roverNavScript');
    
    navScript.value = "";
    startPosX.value = "";
    startPosY.value = "";
    roverNavScript.value = "";
    gridSizeX.value = 5;
    gridSizeY.value = 5;

    roverList = [];
    legendList = [];
    roverStatus = "";

    drawGrid();
    clearLegend();
}

/**
 * Define max value to Initial start position X according to the grid column length 
 * */
function onXChange() {
    var startPosX = document.getElementById('startPosX');
    var gridSizeX = document.getElementById('gridSizeX');

    startPosX.max = gridSizeX.value;
}

/**
 * Define max value to Initial start position Y according to the grid rows length 
 * */
function onYChange() {
    var startPosY = document.getElementById('startPosY');
    var gridSizeY = document.getElementById('gridSizeY');

    startPosY.max = gridSizeY.value;
}   


