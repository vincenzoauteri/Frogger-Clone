//Parent class for the actor entity, according to the pseudoclassical pattern.
//Common between Player and Enemy, has a positon,
//speed and render methods
var Actor = function(sprite) {
    //Actor position (in pixels coordinate space)
    this.position= {
        x: 0,
        y: 0
    };

    //Actor position (in tile coordinate space, not pixels)
    this.tile= {
        x: 0,
        y: 0
    };

    //Won't render if set to false 
    this.draw = false;

    //The image/sprite for the actor
    this.sprite = sprite;
}

// Init the actor with a tile Id
Actor.prototype.init = function(tile) {
    this.tile.x = tile.x;
    this.tile.y = tile.y;
    this.draw = true;
}

//Draws the actor on the screen
Actor.prototype.render = function() {
    if (this.draw) {
        ctx.drawImage(Resources.get(this.sprite), this.position.x, this.position.y);
    }
}

//Draws the actor on the screen
Actor.prototype.update = function(world) {
    this.position.x = this.tile.x * world.tileSize.x;
    this.position.y = this.tile.y * world.tileSize.y - world.tileSize.y/2;
}

// Player variable, subclass of actor 
var Player = function(sprite) {
    Actor.call(this, sprite);
    //Actor movement (in tiles, not pixels)
    this.step = {
        x: 0,
        y: 0
    };

    //Player step (amount of pixels of a single movement)
    this.stepSize = {
        x: 0,
        y: 0
    };
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

//Player init
//Overrides Actor's 
Player.prototype.init = function(world) {
    //Player lives
    this.lives = 3;
    this.stepSize.x = world.tileSize.x; 
    this.stepSize.y = world.tileSize.y; 
    this.draw = true;
};

//Player update
//Overrides Actor's 
Player.prototype.update = function(dt, world) {
    //Player moves 1 tile at a time
    //Calculate new coordinates in tiles space
    if (this.draw) {
        var newTile = {
            x: this.tile.x + this.step.x,
            y: this.tile.y + this.step.y
        };

        //Check for boundaries
        if (world.isTileWalkable(newTile)) { 
            if (newTile.x >= 0 && newTile.x < world.tileMap.totalTiles.x){
                //Update position in tiles space
                this.tile.x = newTile.x;
                //Update position in world space
                this.position.x = this.tile.x * this.stepSize.x;
            }

            //Check for boundaries
            if (newTile.y >= 0 && newTile.y < world.tileMap.totalTiles.y){
                //Update position in tiles space
                this.tile.y = newTile.y;

                //Update position in world space
                this.position.y = (this.tile.y - 1)* this.stepSize.y;
                //Center player on the tile
                this.position.y += world.tileSize.y/2;
            }
        }

    }
    this.step.x = 0;
    this.step.y = 0;
}

//Resets player at the start tile in the map
Player.prototype.resetsPosition= function(world) {
    this.tile.x = world.tileMap.playerStartTile.x;
    this.tile.y = world.tileMap.playerStartTile.y;
}

//Updates coordinates depending on input
Player.prototype.handleInput= function(keyPressed) {
    //Input handling
    //Player is moved according to the pressed key, speed and delta 
    switch (keyPressed) {
        case 'left':
            this.step.x = -1;
            break;
        case 'right':
            this.step.x = 1; 
            break;
        case 'up':
            this.step.y = -1;
            break;
        case 'down':
            this.step.y = 1;
            break;
    }
}

//Enemy class, subclass of actor
var Enemy = function(sprite) {
    Actor.call(this, sprite);
    //Actor's speed.
    this.speed = 0;
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

//Enemy init
//Overrides Actor's 
Enemy.prototype.init = function(startLevel, world) {
   //Enemies are spawned at a random tile 
   var rows = world.enemyRows();
   var randomRow = rows[Math.floor(Math.random()*rows.length)];
   var randomColumn = Math.floor(Math.random()*world.tileMap.totalTiles.x);
   //If it's the first init we spawn in the middle, otherwise from the left side
   //hidden
   if (startLevel) {
       this.position.x = world.tileSize.x*randomColumn; 
   } else {
       this.position.x = -world.tileSize.x;
   }
   this.position.y = randomRow * world.tileSize.y - world.tileSize.y/2; 
   this.speed = 100 + Math.random()*200;
   this.draw = true;
}

// Update the enemy's position, required method for Game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, world) {
    if (this.draw) {
        // Enemy moves horizontally 
        var newX = this.position.x + dt*this.speed;

        //Checking for map boundaries
        //When the enemy reaches the border it respawns at the beginning 

        //Enemies are not created and destroyed, they are reused for the duration
        //of the Game
        if (newX < (world.sizeInPixels.width + world.tileSize.x)) {
            this.position.x = newX;
        } else {
            this.init(0, world) ;
        }
    }
}
