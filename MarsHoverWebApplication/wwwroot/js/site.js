var hoverList = [];
var legendList = [];
var hoverStatus = ""; //Possible values are: Created, LandPending, Saved

/**
 * Add a new hover to the grid
 *
 */
function addHover() {
    var navScript = document.getElementById('navScript');
    var startPosX = document.getElementById('startPosX');
    var startPosY = document.getElementById('startPosY');
    var gridSizeX = document.getElementById('gridSizeX');
    var gridSizeY = document.getElementById('gridSizeY');
    var hoverNavScript = document.getElementById('hoverNavScript');
    var startOrientation = document.getElementById('startOrientation');
    var old = navScript.value;

    if (gridSizeX.value <= 1 || gridSizeY.value <= 1 || gridSizeX.value == "" || gridSizeY.value == "") {
        alert("The grid size may be greater then 1. ");
        return;
    }

    if (startPosX.value == "") {
        alert("Please set the initial position X before adding a hover!");
        return;
    }

    if (startPosY.value == "") {
        alert("Please set the initial position Y before adding a hover!");
        return;
    }

    if (startOrientation.value == "") {
        alert("Please select the initial orientation before adding a hover!");
        return;
    }

    if (hoverStatus == "LandPending") {
        alert("Please land the current hover before adding a new one!");
        return;
    }

    if (hoverStatus == "Created") {
        alert("Please add a navigation to the current hover and land it before adding a new one!");
        return;
    }

    if (hoverStatus == "Saved") {
        drawGrid();
        clearLegend();
        hoverStatus = "";
    }

    //If it is the first hover
    if (old == "") {
        old = gridSizeX.value + " " + gridSizeY.value +";"        
    }

    navScript.value = old + startPosX.value + " " +
        startPosY.value + " " +
        startOrientation.value + ";" +
        hoverNavScript.value +
        (hoverNavScript.value != "" ? ";" : "");

    var color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',1)';
    drawHover(startPosX.value, startPosY.value, gridSizeY.value, gridSizeX.value, startOrientation.value, color, true);
   
    var legendDesc = startPosX.value + " " + startPosY.value + " " +
                        startOrientation.value + " - " +
                        hoverNavScript.value ;
    addLegend(color, legendDesc);

    //Clear only if it has navigation defined
    if (hoverNavScript.value != "") {
        navigate(false);

        startPosX.value = "";
        startPosY.value = "";
        hoverNavScript.value = "";
    } else
    {
        hoverStatus = "Created"
    }
            
}

/**
 * Acumulate navigations to the current hover
 * 
 * @param {any} direction M = move forward, L = rotate to left, R = rotate to right
 */
function addNavigation(direction) { 
    var hoverNavScript = document.getElementById('hoverNavScript');   
    var gridSizeX = document.getElementById('gridSizeX');
    var gridSizeY = document.getElementById('gridSizeY');

    hoverNavScript.value += direction; 

    var lastHover = hoverList[hoverList.length - 1];
    let lastHoverX = lastHover.x;
    let lastHoverY = lastHover.y;
    let lastHoverOrientation = lastHover.orientation;
    
    switch (direction) {

        case "L":
        case "R":
            changeDirection(lastHover, direction);
            clearHover(lastHoverX, lastHoverY, gridSizeX.value, gridSizeY.value);
            break;        
        case "M":
            moveForward(lastHover);
            clearHover(lastHoverX, lastHoverY, gridSizeX.value, gridSizeY.value, lastHoverOrientation);
            break;
    }
        
    drawHover(lastHover.x, lastHover.y, gridSizeY.value, gridSizeX.value, lastHover.orientation, lastHover.color, false)

    hoverStatus = "LandPending"
}

/**
 * Change direction of a hover using a rotation L (rotate to the left) and R (Rotate to the right)
 * Depending on the current orientation
 * @param {any} hover 
 * @param {any} rotation
 */
function changeDirection(hover, rotation) {
    switch (hover.orientation) {

        case "N":
            rotation == "L" ? hover.orientation = "W" : hover.orientation = "E";
            break;
        case "S":
            rotation == "L" ? hover.orientation = "E" : hover.orientation = "W";
            break;
        case "E":
            rotation == "L" ? hover.orientation = "N" : hover.orientation = "S";
            break;
        case "W":
            rotation == "L" ? hover.orientation = "S" : hover.orientation = "N";
            break;

    }
}

/**
 * Move hover forward according to it's orientation
 * @param {any} hover
 */
function moveForward(hover) {

    switch (hover.orientation) {

        case "N":
            hover.y = parseInt(hover.y) - 1;
            break;
        case "S":
            hover.y = parseInt(hover.y) + 1;
            break;
        case "E":
            hover.x = parseInt(hover.x) + 1;
            break;
        case "W":
            hover.x = parseInt(hover.x) - 1;
            break;

    }
}

/**
 * Attach navigation script to the current hover
 */
function addNavigationToHover()
{
    let navScript = document.getElementById('navScript');
    let hoverNavScript = document.getElementById('hoverNavScript');
    let startPosX = document.getElementById('startPosX');
    let startPosY = document.getElementById('startPosY');

    if (startPosX.value == "" || startPosY.value == "") {
        alert("First you need to add a hover to be controlled!");
        return;
    }
    
    if (hoverNavScript.value == "") {
        alert("Please create a navigation for the hover before landing it!");
        return;
    }

    navScript.value = navScript.value.substring(0, navScript.value.length - 1);
    navScript.value += ";" + hoverNavScript.value + ";";
    appendToLegend(hoverNavScript.value, legendList.length - 1);
    
    startPosX.value = "";
    startPosY.value = "";
    hoverNavScript.value = "";
    hoverStatus = "";
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
 * Clear last plotted hover
 * @param {any} x
 * @param {any} y
 * @param {any} rows
 * @param {any} columns
 * @param {any} isRotation
 */
function clearHover(x, y, rows, columns, isRotation) {

    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let colSize = isRotation ? 20 : (width / columns);
    let rowSize = isRotation ? 20 : (height / rows);

    let posX = (width / columns) * x;
    let posY = (height / rows) * y;

    let bottomLegColor = "black";
    let upperLegColor = "black";
    let leftLegColor = "black";
    let rightLegColor = "black";
    
    //Clear rect
    ctx.clearRect(posX - 20, posY - 20, 40, 40);   
    
    //Draw upper leg
    ctx.beginPath();
    ctx.strokeStyle = upperLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX, posY - rowSize);
    ctx.stroke();

    //Draw bottom leg
    ctx.beginPath();
    ctx.strokeStyle = bottomLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX, posY + rowSize);
    ctx.stroke();

    //Draw left leg
    ctx.beginPath();
    ctx.strokeStyle = leftLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX - colSize, posY);
    ctx.stroke();

    //Draw right leg
    ctx.beginPath();
    ctx.strokeStyle = rightLegColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = `rgba(255,99,71,1)`;
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX + colSize, posY);
    ctx.stroke();

}

/**
 * Draw a hover in a defined postion in the grid
 * @param {any} x
 * @param {any} y
 * @param {any} rows
 * @param {any} columns
 * @param {any} orientation
 * @param {any} color
 * @param {any} reverse
 */
function drawHover(x,y,rows,columns, orientation, color, reverse) {

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
            
    //Draw hover body
    ctx.beginPath();
    ctx.fillStyle = color;            
    ctx.ellipse(posX, posY, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
            
    ctx.fill();

    //Draw orientation arrow
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

    var hover = {
        x: x,
        y: y,
        orientation: orientation,
        color: color,
        order: legendList.length
    };

    hoverList = hoverList.filter(i => i.color !== color);
    hoverList.push(hover);
    hoverList.sort(h => h.order);
}

/**
 * Clear hover legends
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

    const apiUrl = 'https://localhost:44394/hover?navScript=' + input.value;
    
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
            let hoverIndex = 0;
            let x = "";
            let y = "";

            for (i = 0; i < data.length; i++) {

                if (data[i] == " ")
                    continue;

                if (index == 2) {                                        
                    var legendColor = document.getElementById("legendBox" + hoverIndex);
                    var color = legendColor.style.backgroundColor;                 
                    drawHover(x, y, rows, columns, data[i], color, true);
                    x = "";
                    y = "";
                    hoverIndex++;
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
                hoverList = [];
                legendList = [];
                hoverStatus = "Saved"
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
    let hoverNavScript = document.getElementById('hoverNavScript');
    
    navScript.value = "";
    startPosX.value = "";
    startPosY.value = "";
    hoverNavScript.value = "";
    gridSizeX.value = 5;
    gridSizeY.value = 5;

    hoverList = [];
    legendList = [];
    hoverStatus = "";

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


