/* 
   Parent class for the Actor entity, according to the pseudoclassical pattern.
   Parent class of Player and Enemy, has a positon,
   speed and render methods 
*/
  
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

    //Entity won't render if set to false 
    this.draw = false;

    //The image/sprite resource for the actor
    this.sprite = sprite;
}

/* 
   Init function for the Actor entity 
*/
Actor.prototype.init = function(tile) {
    this.tile.x = tile.x;
    this.tile.y = tile.y;
    this.draw = true;
}

/* 
   Draws the Actor on screen 
*/
Actor.prototype.render = function() {
    if (this.draw) {
        ctx.drawImage(Resources.get(this.sprite), this.position.x, this.position.y);
    }
}

/* 
   Updates the Actor position in the world 
*/
Actor.prototype.update = function(world) {
    this.position.x = this.tile.x * world.tileSize.x;
    //Centers the sprite on the tile for the y axis
    this.position.y = this.tile.y * world.tileSize.y - world.tileSize.y/2;
}

/* 
   Player entity, subclass of Actor 
   Manages the player character sprite in the world.
   Shares render method but overrides init
   and update functions 
*/
var Player = function(sprite) {
    Actor.call(this, sprite);
    //Actor movement step(in tiles, not pixels)
    //Updated depending on keyboard input
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
//Subclassing to Actor according to pseudoclassical pattern
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

/* 
   Player initialization
    -Resets number of lives
    -Set step size depending on tile size
*/
Player.prototype.init = function(world) {
    //Player lives
    this.lives = 3;
    //Set step size
    this.stepSize.x = world.tileSize.x; 
    this.stepSize.y = world.tileSize.y;
    //Enable rendering
    this.draw = true;
};

/* 
   Player update function
   Keyboard input sets the step variable,
   and this function updates the player characters coordinates
   according to the new value 
*/
Player.prototype.update = function(dt, world) {
    //Player moves 1 tile at a time, calculates new coordinates in tiles space
    if (this.draw) {
        var newTile = {
            //Calculates new tile according to current one and new player input
            x: this.tile.x + this.step.x,
            y: this.tile.y + this.step.y
        };

        //Checks for boundaries in case player would go outside the map
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

/* 
   Resets player at the start tile in the map 
*/
Player.prototype.resetsPosition= function(world) {
    //Starting tile depends on the world map
    this.tile.x = world.tileMap.playerStartTile.x;
    this.tile.y = world.tileMap.playerStartTile.y;
}

/* 
   Updates player step depending on input 
*/
Player.prototype.handleInput= function(keyPressed) {
    //Callback for keyboard input. Updates the player current step used in the update method
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

/* 
   Enemy entity, subclass of Actor 
   Manages the bugs running around the world.
   Shares render method but overrides init
   and update functions 
*/
var Enemy = function(sprite) {
    Actor.call(this, sprite);
    //Actor's speed.
    this.speed = 0;
}
//Subclassing to Actor
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

/* 
   Enemy initialization 
   Enemies are spawned on random rows and tiles at the start of the level 
*/
Enemy.prototype.init = function(startLevel, world) {
   //Enemies are spawned at a random row 
   var rows = world.enemyRows();
   var randomRow = rows[Math.floor(Math.random()*rows.length)];
   var randomColumn = Math.floor(Math.random()*world.tileMap.totalTiles.x);
   //If it's the first init we spawn in the middle, otherwise from the left side
   if (startLevel) {
       this.position.x = world.tileSize.x*randomColumn; 
   } else {
       this.position.x = -world.tileSize.x;
   }
   this.position.y = randomRow * world.tileSize.y - world.tileSize.y/2; 
   //Enemy speed is random as well, between 100 and 300.
   this.speed = 100 + Math.random()*200;
   this.draw = true;
}

/* 
   Update the enemy's position, required method by the engine
    Parameter: dt, a time delta between ticks 
*/
Enemy.prototype.update = function(dt, world) {
    if (this.draw) {
        // Enemy moves horizontally by pixels, not by tiles like the player
        var newX = this.position.x + dt*this.speed;


        //When the enemy reaches the border it respawns at the beginning 
        if (newX < (world.sizeInPixels.width + world.tileSize.x)) {
            this.position.x = newX;
        } else {
            this.init(0, world) ;
        }
    }
}
