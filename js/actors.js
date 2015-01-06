//Parent class for the actor entity, according to the pseudoclassical pattern.
//Common between Player and Enemy, has a positon,
//speed and render methods
var Actor = function(sprite) {
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

// Player variable, subclass of actor 
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

// Enemy class subclass of actor
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
