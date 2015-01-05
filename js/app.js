//Class Game. Stores game related information
//Lives, level, number of enemies...
var Game = function () {
    this.lives = 0;
    this.level = 0;
    this.numberOfEnemies = 0; 
    this.running = 0;
    this.score = 0;
};

Game.prototype.start = function() {
    world.tileMap = world.maps[this.level-1];
    this.running = 1;

    //Enemies from previous level are reused, only new ones are added
    for (var enemyIndex = allEnemies.length; enemyIndex < game.numberOfEnemies * this.level ; enemyIndex++) {
        allEnemies.push(new Enemy('images/enemy-bug.png'));
    }
};

Game.prototype.init = function(level, lives, score) {
    //world variable is filled by the data in engine.js
    //and used by the entities;
    world = new World();

    this.lives = lives;
    this.level = level;
    this.numberOfEnemies = 5; 

    //Enemies are spawned when the game is started.
    allEnemies = [];

    player = new Player('images/char-boy.png');
    princess = new Actor('images/char-princess-girl.png');
    extras = []; 
    extras.push (new Actor('images/char-cat-girl.png'));
    extras.push (new Actor('images/char-pink-girl.png'));
    extras.push (new Actor('images/char-horn-girl.png'));
    extras.push (new Actor('images/Heart.png'));
};

Game.prototype.victorySequence = function() {
    //End sequence. Not very flexible, but it's one-off
    this.running = 0;
    world.tileMap = world.victoryMap; 
    //Characters will be placed on the grass tiles of victoryMap
    var endTiles = world.getTilesOfType('g');
    console.log(endTiles);
    princess.tileX = endTiles[0].x; 
    princess.tileY = endTiles[0].y; 
    player.tileX = endTiles[2].x; 
    player.tileY = endTiles[2].y; 
    extras[0].init(endTiles[3]);
    extras[1].init(endTiles[4]);
    extras[2].init(endTiles[5]);
    extras[3].init(endTiles[1]);
    //Hide enemies
    allEnemies.forEach(function(enemy) {
        enemy.x = -world.tileSize.x;
        enemy.speed = 0; 
    });
};

var World = function() {
    //Size of the world map (in pixels)
    this.sizeInPixels = {
        width: 0,
        height: 0
    }
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
    }
    ];
    //This is the map used for the current game
    this.tileMap = {};
    //Tiles on which the player can walk
    this.walkableTiles = ['g','s','x'];
    //Tiles on which the enemy can be spawned 
    this.enemyTiles= ['s'];
};

World.prototype.checkVictory = function()  {
    if (game.running === 1) { 
        var collisionZone = 50;
        if ((Math.abs(princess.x - player.x) < collisionZone) &&
                (Math.abs(princess.y - player.y) < collisionZone)) {
                    console.log(game.level);
                    game.level++;
                    if (game.level <= 3) {
                        game.start(game.level,3,0);
                        return true;
                    } else {
                        game.victorySequence();
                    }
                }
    
    }
    return false;
}
World.prototype.checkCollisions = function()  {
    if (game.running === 1) { 
        var collisionZone = 50;
        allEnemies.forEach(function(enemy) {
            if ((Math.abs(enemy.x - player.x) < collisionZone) &&
                (Math.abs(enemy.y - player.y) < collisionZone)) {
                    game.lives--;
                    player.tileX = world.tileMap.playerStartTile.x;
                    player.tileY = world.tileMap.playerStartTile.y;
                }
        });
    }
}

World.prototype.init = function(sizeInPixels, tileSize) {
    this.sizeInPixels = sizeInPixels;
    this.tileSize = tileSize;
    console.log(this);
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
        if (world.tileMap.map[tileMapIndex] === type) {
            console.log(tileMapIndex);
            result.push({
                x: Math.floor(tileMapIndex % this.tileMap.totalTiles.x),
                y: Math.floor(tileMapIndex / this.tileMap.totalTiles.x) 
            });
        }
    }
    return result;
}

//Parent class for the actor entity, according to the pseudoclassical pattern.
//Common between Player and Enemy, has a positon,
//speed and render methods
var Actor = function(sprite, startX, startY) {
    //Starting coordinates for spawned actor 
    this.x = startX;
    this.y = startY;
    //Actor position (in tiles, not pixels)
    this.tileX = 0;
    this.tileY = 0;

    //Won't update or render if not initialized
    this.isInitialized = false;
    
    //The image/sprite for the actor
    this.sprite = sprite;
}
// Init the actor with a tile Id
Actor.prototype.init = function(tile) {
    this.tileX = tile.x;
    this.tileY = tile.y;
    this.isInitialized = true;
}

// Draw the actor on the screen
Actor.prototype.render = function() {
    if (this.isInitialized) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// Draw the actor on the screen
Actor.prototype.update= function() {
    if (this.isInitialized) {
        this.x = this.tileX * world.tileSize.x;
        this.y = this.tileY * world.tileSize.y - world.tileSize.y/2;
    }
}

// Player  
var Player = function(sprite) {
    Actor.call(this, sprite, 0, 0);
    //Actor movement (in tiles, not pixels)
    this.stepX = 0;
    this.stepY = 0;
    this.stepSizeY = 0; 
    this.stepSizeX = 0; 
}
Player.prototype = Object.create(Actor.prototype);
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.constructor = Player;
Player.prototype.init= function() {
    //Actor position (in tiles, not pixels)
    this.tileX = world.tileMap.playerStartTile.x;
    this.tileY = world.tileMap.playerStartTile.y;

    this.stepSizeX = world.tileSize.x; 
    this.stepSizeY = world.tileSize.y; 
    this.isInitialized = true;
};

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Player moves 1 tile at a time

    //Calculate new coordinates in tiles space

    if (this.isInitialized) {
        var newTileX = this.tileX + this.stepX;
        var newTileY = this.tileY + this.stepY;

        //Check for boundaries
        if (world.isTileWalkable(newTileX,newTileY)) { 
            //Check for win condition
            if (newTileX >= 0 && newTileX < world.tileMap.totalTiles.x){
                //Update position in tiles space
                this.tileX = newTileX;

                //Update position in world space
                this.x = this.tileX * this.stepSizeX;
            }

            //Check for boundaries
            if (newTileY >= 0 && newTileY < world.tileMap.totalTiles.y){
                //Update position in tiles space
                this.tileY = newTileY;

                //Update position in world space
                this.y = (this.tileY - 1)* this.stepSizeY;
                //Center player on the tile
                this.y += world.tileSize.y/2;
            }
        }

        //Checking for map boundaries
        //Movement is not allowed when the player reaches the borders
    }
    this.stepX = 0;
    this.stepY = 0;
}

Player.prototype.handleInput= function(keyPressed) {
    //Input handling
    //Player is moved according to the pressed key, speed and delta 
    switch (keyPressed) {
        case 'left':
            this.stepX = -1;
            break;
        case 'right':
            this.stepX = 1; 
            break;
        case 'up':
            this.stepY = -1;
            break;
        case 'down':
            this.stepY = 1;
            break;
    }
}

// Enemies our player must avoid
var Enemy = function(sprite, startX, startY) {
    Actor.call(this, sprite, startX, startY);
    //Actor's speed.
    this.speed = 0;
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.init = function() {
   //Enemies are spawned at a random row, always one tile before the leftmost one 
   var rows = world.enemyRows();
   var randomRow = rows[Math.floor(Math.random()*rows.length)];
   this.x = -world.tileSize.x; 
   this.y = randomRow * world.tileSize.y - world.tileSize.y/2; 
   this.speed = 100 + Math.random()*200;
   this.isInitialized = true;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.isInitialized) {
        var newTileX = this.tileX + this.stepX;
        // Enemy moves horizontally 
        var newX = this.x + dt*this.speed;

        //Checking for map boundaries
        //When the enemy reaches the border it respawns at the beginning 

        //Enemies are not created and destroyed, they are reused for the duration
        //of the game
        if (newX < world.sizeInPixels.width) {
            this.x = newX;
        } else {
            this.init() ;
        }
    }
}

//Main app code 
//game variable is the main variable representing current game state 
var game = new Game();
game.init(1,3,0);
game.start();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
