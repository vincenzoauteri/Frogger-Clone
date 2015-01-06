
//Class Game. Stores game related information
//Lives, level, number of enemies...
var Game = function () {
    this.lives = 0;
    this.level = 0;
    this.numberOfEnemies = 0; 
    this.running = 0;
    this.world = {};
    this.player= {};
    this.allEnemies= {};
    this.princess = {};
    this.extras = {};
};

Game.prototype.startLevel = function(reset) {
    if (reset) {
        this.level = 1;
        this.lives = 3;
        this.score = 0;
    }

    this.world.tileMap = this.world.maps[this.level-1];
    this.running = 1;
    //Enemies from previous level are reused, only new ones are added
    for (var enemyIndex = this.allEnemies.length; enemyIndex < this.numberOfEnemies * this.level ; enemyIndex++) {
        this.allEnemies.push(new Enemy('images/enemy-bug.png'));
    }
    this.princess = this.extras[this.level - 1];
};

Game.prototype.init = function(level, lives, score) {
    //world variable is filled by the data in engine.js
    //and used by the entities;
    this.world = new World();

    this.lives = lives;
    this.level = level;
    this.numberOfEnemies = 1; 

    //Enemies are spawned when the game is started.
    this.allEnemies = [];

    this.player = new Player('images/char-boy.png');
    this.extras = []; 
    this.extras.push (new Actor('images/char-cat-girl.png'));
    this.extras.push (new Actor('images/char-pink-girl.png'));
    this.extras.push (new Actor('images/char-horn-girl.png'));
    this.extras.push (new Actor('images/char-princess-girl.png'));
    this.extras.push (new Actor('images/Heart.png'));
};

Game.prototype.checkCollisions = function()  {
    if (this.running === 1) { 
        //Collision boundary. Not really precise, but will do for 
        //this game
        var collisionZone = 50;
        this.allEnemies.forEach(function(enemy) {
            if ((Math.abs(enemy.x - game.player.x) < collisionZone) &&
                (Math.abs(enemy.y - game.player.y) < collisionZone)) {
                    this.lives--;
                    if (this.lives === 0) {
                        game.startLevel(true);
                    }
                    this.player.tileX = this.world.tileMap.playerStartTile.x;
                    this.player.tileY = this.world.tileMap.playerStartTile.y;
                }
        },this);
    }
}

Game.prototype.victorySequence = function() {
    //End sequence. Not very flexible, but it's one-off
    this.running = 0;
    this.world.tileMap = this.world.victoryMap; 
    //Characters will be placed on the grass tiles of victoryMap
    var endTiles = this.world.getTilesOfType('g');
    this.player.tileX = endTiles[0].x; 
    this.player.tileY = endTiles[0].y; 
    this.extras[0].init(endTiles[3]);
    this.extras[1].init(endTiles[4]);
    this.extras[2].init(endTiles[5]);
    this.extras[3].init(endTiles[2]);
    this.extras[4].init(endTiles[1]);
    //Hide enemies
    this.allEnemies.forEach(function(enemy) {
        enemy.draw = false;
    } );
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
        if ((Math.abs(game.princess.x - game.player.x) < collisionZone) &&
                (Math.abs(game.princess.y - game.player.y) < collisionZone)) {
                    console.log(game.level);
                    game.level++;
                    if (game.level <= game.world.maps.length) {
                        game.princess.draw = false;
                        game.score += 1000;
                        game.startLevel(false);
                        return true;
                    } else {
                        game.victorySequence();
                    }
                }
    
    }
    return false;
}


World.prototype.init = function(sizeInPixels, tileSize) {
    console.log(this);
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
        if (this.tileMap.map[tileMapIndex] === type) {
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

    //Won't render if set to false 
    this.draw = false;

    //The image/sprite for the actor
    this.sprite = sprite;
}
// Init the actor with a tile Id
Actor.prototype.init = function(tile) {
    this.tileX = tile.x;
    this.tileY = tile.y;
    this.draw = true;
}

// Draw the actor on the screen
Actor.prototype.render = function() {
    if (this.draw) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Draw the actor on the screen
Actor.prototype.update= function() {
    this.x = this.tileX * game.world.tileSize.x;
    this.y = this.tileY * game.world.tileSize.y - game.world.tileSize.y/2;
}

// Player variable 
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
    this.tileX = game.world.tileMap.playerStartTile.x;
    this.tileY = game.world.tileMap.playerStartTile.y;

    this.stepSizeX = game.world.tileSize.x; 
    this.stepSizeY = game.world.tileSize.y; 
    this.draw = true;
};

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Player moves 1 tile at a time

    //Calculate new coordinates in tiles space

    if (this.draw) {
        var newTileX = this.tileX + this.stepX;
        var newTileY = this.tileY + this.stepY;

        //Check for boundaries
        if (game.world.isTileWalkable(newTileX,newTileY)) { 
            //Check for win condition
            if (newTileX >= 0 && newTileX < game.world.tileMap.totalTiles.x){
                //Update position in tiles space
                this.tileX = newTileX;

                //Update position in world space
                this.x = this.tileX * this.stepSizeX;
            }

            //Check for boundaries
            if (newTileY >= 0 && newTileY < game.world.tileMap.totalTiles.y){
                //Update position in tiles space
                this.tileY = newTileY;

                //Update position in world space
                this.y = (this.tileY - 1)* this.stepSizeY;
                //Center player on the tile
                this.y += game.world.tileSize.y/2;
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
   var rows = game.world.enemyRows();
   var randomRow = rows[Math.floor(Math.random()*rows.length)];
   this.x = -game.world.tileSize.x; 
   this.y = randomRow * game.world.tileSize.y - game.world.tileSize.y/2; 
   this.speed = 100 + Math.random()*200;
   this.draw = true;
}
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.draw) {
        var newTileX = this.tileX + this.stepX;
        // Enemy moves horizontally 
        var newX = this.x + dt*this.speed;

        //Checking for map boundaries
        //When the enemy reaches the border it respawns at the beginning 

        //Enemies are not created and destroyed, they are reused for the duration
        //of the game
        if (newX < game.world.sizeInPixels.width + game.world.tileSize.x) {
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
game.startLevel();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});
