// -----JS CODE-----
//@input Asset.ObjectPrefab myPrefab
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
print("Game started");

if(script.mines > (script.gridx*script.gridy)){
    print("More mines then cells");
    script.mines = script.gridx*script.gridy+1;
}

var grid = [];
var touchTime = 0;



function run(){
    buildPrefabs();
    placeMines();
    placeNumbers();
}

function buildPrefabs(){

    for (var i = 0; i < script.gridx; i++) {
        grid[i] = [];
    }

    for (var i = 0; i < script.gridx; i++) {
        for (var j = 0; j < script.gridy; j++) {
            var obj = createObjectFromPrefab();
            obj.getTransform().setLocalScale(new vec3(5, 5, 1));
            obj.getTransform().setLocalPosition(new vec3((-20 + (i * obj.getTransform().getLocalScale().x)), ((-20 + (j * obj.getTransform().getLocalScale().y)) * -1), -40));
            obj.name = "" + i + ":" + j;
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

script.api.cellClickedEnd = function (event) {
    var obj = event.getSceneObject();
    var tkn = obj.name.split(":");

    var cell = grid[tkn[0]][tkn[1]];

    var touchLength = getTime() - touchTime;
    if(touchLength >= 0.3){
        flagCell(cell);
    }else{
        openCell(cell);
    }
}

script.api.cellClickedStart = function(event){
    touchTime = getTime();
}

function flagCell(cell){
    if(!cell.open){
        var img = cell.object.getComponentByIndex("Image", 0);
        img.clearMaterials();
        if(cell.flagged){
            img.addMaterial(script.cellClosed);
        }else{
            img.addMaterial(script.cellFlagged);
        }
        cell.flagged = !cell.flagged;
    }   
}

function openCell(cell){
    if (cell.flagged) {
        return;
    }

    if(cell.mine == true){
        mineHit(cell);
        return;
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
                    neigh[i].open = true;
                    stack.push(neigh[i]);
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

function mineHit(cell){
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




function createObjectFromPrefab(){
    if(script.myPrefab){
        var instanceObject = script.myPrefab.instantiate(script.getSceneObject());
        return instanceObject;
    }
    else{
        return undefined;
    }
}

run();