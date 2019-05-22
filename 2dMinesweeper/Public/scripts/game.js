// -----JS CODE-----
//@input Asset.ObjectPrefab buttonPrefab
//@input Asset.ObjectPrefab imagePrefab
//@input SceneObject smileButton
//@input int gridx
//@input int gridy
//@input int mines
//@input Asset.Material cellClosed
//@input Asset.Material cellOpen
//@input Asset.Material cellFlagged
//@input Asset.Material cellMine
//@input Asset.Material cellMineHit
//@input Asset.Material wrongFlag
//@input Asset.Material cellNum_1
//@input Asset.Material cellNum_2
//@input Asset.Material cellNum_3
//@input Asset.Material cellNum_4
//@input Asset.Material cellNum_5
//@input Asset.Material cellNum_6
//@input Asset.Material cellNum_7
//@input Asset.Material cellNum_8
//@input Asset.Material smile
//@input Asset.Material smile_glasses
//@input Asset.Material smile_dead
//@input Asset.Material number_0
//@input Asset.Material number_1
//@input Asset.Material number_2
//@input Asset.Material number_3
//@input Asset.Material number_4
//@input Asset.Material number_5
//@input Asset.Material number_6
//@input Asset.Material number_7
//@input Asset.Material number_8
//@input Asset.Material number_9

print("Game started");

if(script.mines > (script.gridx*script.gridy)){
    print("More mines then cells");
    script.mines = script.gridx*script.gridy+1;
}

var grid, touchTime, gameOver, clicks, startTime, finalTime, flagsPlaced, smileButton, timer, mineCount, gameid;
var numbers = [];
numbers[0] = script.number_0;
numbers[1] = script.number_1;
numbers[2] = script.number_2;
numbers[3] = script.number_3;
numbers[4] = script.number_4;
numbers[5] = script.number_5;
numbers[6] = script.number_6;
numbers[7] = script.number_7;
numbers[8] = script.number_8;
numbers[9] = script.number_9;


//Start a new game
function run(){
    grid = [];
    touchTime = 0;
    gameOver = false;
    clicks = 0;
    finalTime = 0;
    flagsPlaced = 0;
    gameid = Math.random();
    setTexture(smileButton,script.smile);
    setDotDisplay(timer, 0);
    setDotDisplay(mineCount, script.mines - flagsPlaced);
    buildPrefabs();
    placeMines();
    placeNumbers();
}

//draw cells on screen
function buildPrefabs(){
    for (var i = 0; i < script.gridx; i++) {
        grid[i] = [];
    }

    for (var i = 0; i < script.gridx; i++) {
        for (var j = 0; j < script.gridy; j++) {
            var obj = createObjectFromPrefab(script.buttonPrefab);
            obj.getTransform().setLocalScale(new vec3(5, 5, 1));
            obj.getTransform().setLocalPosition(new vec3((-20 + (i * obj.getTransform().getLocalScale().x)), ((-20 + (j * obj.getTransform().getLocalScale().y)) * -1), -40));
            obj.name = "cell:" + i + ":" + j;
            grid[i][j] = {
                number: 0,
                mine: false,
                x: i,
                y: j,
                flagged: false,
                object: obj,
                open: false,
                object: obj
            };
        }
    }
}

//dot display for timer and mine counter
function setDotDisplay(arr, num){
    //dont want to do negatives 
    if(num < 0){
        return;
    }
    var string = num.toString();
    if(string.length > 3){
        string = "999";
    }
    var offset = (3 - string.length);
    for (var i = 0; i < arr.length; i++){
        if(i >= offset){
            setTexture(arr[i], numbers[parseInt(string[i-offset])]);
        }else{
            setTexture(arr[i], numbers[0]);
        }  
    }
}

//place mines on board
function placeMines(){
    var placedMines = 0;
    while(placedMines != script.mines){
        var x = Math.floor(Math.random()*script.gridx);
        var y = Math.floor(Math.random()*script.gridy);
        if (!grid[x][y].mine){
            grid[x][y].mine = true;
            placedMines++;
        }
    }
}

//place numbers on board
function placeNumbers(){
    for (var i = 0; i < script.gridx; i++) {
        for (var j = 0; j < script.gridy; j++){
            if(!grid[i][j].mine){
                var cells = getNeighbours(i,j);
                var mineCount = 0;
                for(var z = 0; z<cells.length; z++){
                    if(cells[z].mine){
                        mineCount++;
                    }
                }
                grid[i][j].number = mineCount;
            }
        } 
    }
}

//get all neighbour cells for a mine, return in an array
function getNeighbours(x,y){
    var cells = [];
    var oldX = x;
    var oldY = y;
    for(var i = -1; i<2; i++){
        x = i + oldX;
        for(var j = -1; j<2; j++){
            y = j + oldY;
            if(x < script.gridx && x > -1 && y < script.gridy && y > -1){
                cells.push(grid[x][y]);
            }
        }
    }
    return cells;   
}

//Click end event for a button
script.api.cellClickedEnd = function (event) {
    var obj = event.getSceneObject();
    var tkn = obj.name.split(":");

    if(tkn[0] == "cell"){
        if (gameOver) {
            return;
        }
        var cell = grid[tkn[1]][tkn[2]];

        var touchLength = getTime() - touchTime;
        if (touchLength >= 0.3) {
            flagCell(cell);
        } else {
            if (clicks == 0) {
                startTime = getTime();
                delayedEvent.reset(0);
            }
            openCell(cell);
            clicks++;
            checkWin();
        }
    }else if(tkn[0] == "smile"){
        reset();
    }  
}

//Click start event for a button
script.api.cellClickedStart = function(){
    touchTime = getTime();
}

//Timer script
var delayedEvent = script.createEvent("DelayedCallbackEvent");
delayedEvent.bind(function(event){
    if(gameOver){
        return;
    }
    setDotDisplay(timer, Math.ceil(getTime() - startTime));
    delayedEvent.reset(0.1);
});

//Check if player has won
function checkWin(){
    for (var i = 0; i < script.gridx; i++) {
        for (var j = 0; j < script.gridy; j++) {
            if(!grid[i][j].mine && !grid[i][j].open){
                return;
            }
        }
    }
    gameOver = true;
    finalTime = Math.ceil(getTime() - startTime);
    setTexture(smileButton,script.smile_glasses);
    setDotDisplay(timer, finalTime);
}

//Flag a cell
function flagCell(cell){
    if(!cell.open){
        var img = cell.object.getComponentByIndex("Image", 0);
        img.clearMaterials();
        if(cell.flagged){
            img.addMaterial(script.cellClosed);
            flagsPlaced--;
        }else{
            img.addMaterial(script.cellFlagged);
            flagsPlaced++;
        }
        cell.flagged = !cell.flagged;
        setDotDisplay(mineCount, script.mines - flagsPlaced);
    }   
}

//Open a cell
function openCell(cell){
    if (cell.flagged) {
        return;
    }
    if(cell.mine){
        if(clicks == 0){
            cell.mine = false;
            newMine: for (var i = 0; i < script.gridx; i++) {
                for (var j = 0; j < script.gridy; j++) {
                    if(!grid[i][j].mine){
                        grid[i][j].mine = true;
                        placeNumbers();
                        break newMine;
                    }
                }
            }
        }else{
            mineHit(cell);
            return;
        } 
    }

    var stack = [];
    if(cell.number == 0){
        stack.push(cell);
        
        while(stack.length != 0){ 
            var c = stack.pop();
            var x = c.x;
            var y = c.y;
            var img = c.object.getComponentByIndex("Image", 0);
            setNumber(c, img);
            
            if(c.number == 0){
                var neigh = getNeighbours(x, y);
                for (var i = 0; i < neigh.length; i++) {
                    if (neigh[i].open == true) {
                        continue;
                    }
                    if(!neigh[i].flagged){
                        neigh[i].open = true;
                        stack.push(neigh[i]);
                    }
                    
                }
            }
        }
    }
    else{
        cell.open = true;
        var img = cell.object.getComponentByIndex("Image", 0);
        setNumber(cell, img);
    }
}

//End game when mine hit
function mineHit(cell){
    gameOver = true;
    setTexture(smileButton,script.smile_dead);
    setDotDisplay(timer, Math.ceil(getTime() - startTime));
    for(var i = 0; i<script.gridx; i++){
        for(var j = 0; j< script.gridy; j++){
            if(grid[i][j].mine){
                var img = grid[i][j].object.getComponentByIndex("Image", 0);
                img.clearMaterials();
                if(i == cell.x && j == cell.y){
                    img.addMaterial(script.cellMineHit);
                }else{
                    img.addMaterial(script.cellMine);
                }    
            }
            if(grid[i][j].flagged && !grid[i][j].mine){
                var img = grid[i][j].object.getComponentByIndex("Image", 0);
                img.clearMaterials();
                img.addMaterial(script.wrongFlag);
            }
        }
    }
}

//Reset game
function reset(){
    gameOver = true;
    //need to wait for game time to loop back and recognise that game is over
    var delayedEvent2 = script.createEvent("DelayedCallbackEvent");
    delayedEvent2.bind(function (event) {
        for (var i = 0; i < script.gridx; i++) {
            for (var j = 0; j < script.gridy; j++) {
                grid[i][j].object.destroy();
            }
        }
        run();
    });
    delayedEvent2.reset(0.2);   
}

//Set number texture
function setNumber(cell, img){
    img.clearMaterials();
    switch (cell.number) {
        case 0:
            img.addMaterial(script.cellOpen);
            break;
        case 1:
            img.addMaterial(script.cellNum_1);
            break;
        case 2:
            img.addMaterial(script.cellNum_2);
            break;
        case 3:
            img.addMaterial(script.cellNum_3);
            break;
        case 4:
            img.addMaterial(script.cellNum_4);
            break;
        case 5:
            img.addMaterial(script.cellNum_5);
            break;
        case 6:
            img.addMaterial(script.cellNum_6);
            break;
        case 7:
            img.addMaterial(script.cellNum_7);
            break;
        case 8:
            img.addMaterial(script.cellNum_8);
            break;
    }
}

//Create top UI
function createUI(){
    smileButton = createObjectFromPrefab(script.buttonPrefab);
    smileButton.getTransform().setLocalScale(new vec3(4, 4, 1));
    smileButton.getTransform().setLocalPosition(new vec3(0, 15, 0));
    smileButton.name = "smile";
    setTexture(smileButton, script.smile);

    timer = [];
    for(var i = 0; i<3; i++){
        timer[i] = createObjectFromPrefab(script.imagePrefab);
        timer[i].getTransform().setLocalScale(new vec3(3, 4, 1));
        timer[i].getTransform().setLocalPosition(new vec3(5 + (i*2.3), 15, 0));
        setTexture(timer[i], script.number_0);
    }

    mineCount = [];
    for(var i = 0; i<3; i++){
        mineCount[i] = createObjectFromPrefab(script.imagePrefab);
        mineCount[i].getTransform().setLocalScale(new vec3(3, 4, 1));
        mineCount[i].getTransform().setLocalPosition(new vec3((3 + ((3-i)*2.3))*-1, 15, 0));
        setTexture(mineCount[i], script.number_0);
    }
}

//Set sceneObject texture
function setTexture(object, img){   
    var image = object.getComponentByIndex("Image", 0);
    if(image){
        image.clearMaterials();
        image.addMaterial(img);
    }
}

//Load an object from prefab
function createObjectFromPrefab(prefab){
    if (prefab){
        var instanceObject = prefab.instantiate(script.getSceneObject());
        return instanceObject;
    }
    else{
        return undefined;
    }
}


createUI();
run();