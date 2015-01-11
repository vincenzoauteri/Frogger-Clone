var World = function() {
    //Size of the world map (in pixels)
    this.sizeInPixels = {
        width: 0,
        height: 0
    }
    //Tile size in pixels. Depends on the bitmaps, defined on init 
    this.tileSize= {
        x: 0,
        y: 0
    };
    //World representation, as an array of Tiles
    //'w' for water
    //'s' for stone
    //'g' for grass
    //'x' for goal 
    this.victoryMap =  
    {
        totalTiles: {
            x: 5,
            y: 6
        },
        map: [
        'w','w','w','w','w',
        's','w','w','w','s',
        's','w','s','w','s',
        's','g','g','g','s',
        'g','w','w','w','g',
        's','s','g','s','s'
        ]
    };

    this.maps= [
    { 
        totalTiles :{
            x: 5,
            y: 6
        },
        playerStartTile : {
            x: 2,
            y: 5
        },
        map: [
        'w','w','x','w','w',
        's','s','s','s','s',
        's','s','s','s','s',
        's','s','s','s','s',
        'g','g','g','g','g',
        'g','g','g','g','g'
        ] 
    }, 
    {
        totalTiles: {
            x: 5,
            y: 8
        },
        playerStartTile : {
            x: 2,
            y: 7
        },
        map:[
            'w','w','x','w','w',
            's','s','s','s','s',
            's','s','s','s','s',
            's','s','s','s','s',
            'w','w','g','w','w',
            's','s','s','s','s',
            's','s','s','s','s',
            'g','g','g','g','g'
        ]
    },
    {
        totalTiles: {
            x: 7,
            y: 10 
        },
        playerStartTile : {
            x: 3,
            y: 9
        },
        map:[
            'w','w','w','x','w','w','w',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            'w','w','g','g','g','w','w',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            'g','g','g','g','g','g','g'
        ]
    },
    {
        totalTiles: {
            x: 7,
            y: 12 
        },
        playerStartTile : {
            x: 3,
            y: 11 
        },
        map:[
            'w','w','w','x','w','w','w',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            's','s','s','s','s','s','s',
            'g','g','g','g','g','g','g'
        ]
    }
    ];
    //This is the map used for the current Game
    this.tileMap = {};
    //Tiles on which the player can walk
    this.walkableTiles = ['g','s','x'];
    //Tiles on which the enemy can be spawned 
    this.enemyTiles= ['s'];
};

World.prototype.init = function(sizeInPixels, tileSize) {
    this.sizeInPixels = sizeInPixels;
    this.tileSize = tileSize;
}

//Check if player can walk on tile, in which case the tile type is listed
//in the array walkableTiles
World.prototype.isTileWalkable = function(tileX, tileY) {
    var result = false;
    
    var tileType = this.tileMap.map[tileX + tileY*this.tileMap.totalTiles.x];

    if (tileType &&  (this.walkableTiles.indexOf(tileType) > -1)){
        //If tile exists and it is walkable returns true
        result = true;
    }
    return result; 
}


//Returns an array with the indexes of the rows on which enemies can be spawned
World.prototype.enemyRows= function() {
    var result = [];
    for (var rowIndex = 0; rowIndex < this.tileMap.totalTiles.y; rowIndex++){
        //Reads only the first tile of each row, it is enough since
        //enemy rows must be omogenous
        var tileType = this.tileMap.map[rowIndex*this.tileMap.totalTiles.x];
        if (tileType &&  (this.enemyTiles.indexOf(tileType) > -1)){
            result.push(rowIndex);
        }
    }
    return result;
}
//Returns an array with the tiles coordinates of a specific type
World.prototype.getTilesOfType= function(type) {
    var result = []; 
    for (var tileMapIndex = 0; tileMapIndex < this.tileMap.map.length; tileMapIndex ++) {
        if (this.tileMap.map[tileMapIndex] === type) {
            result.push({
                x: Math.floor(tileMapIndex % this.tileMap.totalTiles.x),
                y: Math.floor(tileMapIndex / this.tileMap.totalTiles.x) 
            });
        }
    }
    return result;
}
