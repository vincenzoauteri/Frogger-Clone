//Class Game. Stores game related information
//Level, number of enemies...
//
var Game = function (){
    //Level number - depends on the number of maps in the world variable 
    this.level = 1;
    //Number of enemies constant number of spawned enemies
    this.numberOfEnemies = 7 ; 
    //Variable that records the runing state of the game
    this.running = false ;
    //Variable that holds an object of class world. Will be overridden on init 
    this.world  = function() {} ;
    //Variable that holds an object of class Player. Will be overridden on init 
    this.player  = function() {} ;
    //Variable that holds an array of Enemy objects. Will be filled on init 
    this.allEnemies  = [];
    //Variable that holds an Actor object, that serves as the goal for the level 
    this.princess  = 0,
    //Variable that holds an array of Actors, hold all the character bitmaps 
    this.extras  = [];
};

//Called at the start of a new level
Game.prototype.startLevel = function(reset) {
    //If player died, resets the game to level 1
    if (reset) {
        this.level = 1;
        this.score = 0;
        this.player.lives = 3;
    }

    //Init World
    this.world.tileMap = this.world.maps[this.level-1]; 
    //Init Enemies. 
    this.allEnemies = [];
    var numberOfEnemiesInLevel = this.numberOfEnemies * this.level; 
    for (var enemyIndex = this.allEnemies.length; enemyIndex < numberOfEnemiesInLevel ; enemyIndex++) {
        var enemy = new Enemy('images/enemy-bug.png');
        enemy.init(true, this.world); 
        this.allEnemies.push(enemy);
    }

    //Repositions the player at the start of the level
    this.player.resetsPosition(this.world);

    //Hide all extras (since only the princess is used for the current level)
    this.extras.forEach(function(extra) {
        extra.draw = false;
    });

    //Init Princess (the model changes depending on the level
    this.princess = this.extras[this.level - 1];
    this.princess.init(this.world.getTilesOfType('x')[0]);

    this.running = true; 
};

Game.prototype.init = function(pixelDimensions, tileSize) {
    //World variable is filled by the data in engine.js
    //and used by the entities;
    this.world = new World();
    this.world.init(pixelDimensions, tileSize);

    //Constant. Could be changed if difficulty level is introduced
    this.numberOfEnemies = 6; 


    //Enemies are spawned when the game is started.
    this.allEnemies = [];

    this.player = new Player('images/char-boy.png');
    //Init Player 
    this.player.init(this.world);
    
    //Allocates the extras 
    this.extras = []; 
    this.extras.push (new Actor('images/char-cat-girl.png'));
    this.extras.push (new Actor('images/char-pink-girl.png'));
    this.extras.push (new Actor('images/char-horn-girl.png'));
    this.extras.push (new Actor('images/char-princess-girl.png'));
    this.extras.push (new Actor('images/Heart.png'));

    //Automatically starts level 1
    this.startLevel(true);
};

//Checks collision between two Actors 
Game.prototype.checkCollisionBetween = function(actor1, actor2)  {
    var result = false;
    //Collision boundary. Not really precise, but will do for 
    //game
    var collisionZone = 50;
    if ((Math.abs(actor1.position.x - actor2.position.x) < collisionZone) &&
            (Math.abs(actor1.position.y - actor2.position.y) < collisionZone)) {
                result = true;
            }
    return result;
}

//Checks collision between player and enemies
Game.prototype.checkCollisions = function()  {
    if (this.running === true) { 
        this.allEnemies.forEach(function(enemy) {
            if (this.checkCollisionBetween(enemy,this.player)) {
                    if (this.player.lives > 0 ){
                        //Reduces lives by one
                        this.player.lives--;
                    }
                    //Resets player to staring position
                    this.player.resetsPosition(this.world);
                }
        }, this);
    }
}

//checks for winning conditions (collision with goal)
Game.prototype.checkVictory = function()  {
    if (this.running === true) { 
            if (this.checkCollisionBetween(this.player,this.princess)) {
                    this.level++;
                    this.score += 1000;
                    if (this.level <= this.world.maps.length) {
                        //Next level
                        this.princess.draw = false;
                        this.startLevel(false);
                        return true;
                    } else {
                        //Game won!
                        this.victorySequence();
                    }
                }
    }
    return false;
}

//checks for losing conditions (player lives === 0)
Game.prototype.checkDefeat = function()  {
    var result = false;
    if (this.player.lives <= 0) {
        this.startLevel(true);
        result = true;
    }
    return result;
}

//End sequence. Not very flexible, but it's one-off
Game.prototype.victorySequence = function() {
    this.running = false;
    //Loads dedicated map
    this.world.tileMap = this.world.victoryMap; 
    //Characters will be placed on the grass tiles of victoryMap
    //used as placeholder
    var endTiles = this.world.getTilesOfType('g');
    this.player.tile.x = endTiles[0].x; 
    this.player.tile.y = endTiles[0].y; 
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


