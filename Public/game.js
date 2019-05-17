// -----JS CODE-----
//@input Asset.ObjectPrefab myPrefab
//@input int gridx
//@input int gridy
//@input int mines
print("Game started");

if(script.mines > (script.gridx*script.gridy)){
    print("More mines then cells");
    script.mines = script.gridx*script.gridy+1;
}

var grid = [];




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
                open: false
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

script.api.cellClicked = function(event){
    var obj = event.getSceneObject();
    var tkn = obj.name.split(":");

    //dont open flagged
    grid[tkn[0]][tkn[1]].number.open = false;

    event.obj.getComponentByIndex("Image", 1);
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