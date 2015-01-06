//Class Game. Stores game related information
//Lives, level, number of enemies...
//
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

//Start new level
Game.prototype.startLevel = function(reset) {
    if (reset) {
        this.level = 1;
        this.lives = 3;
        this.score = 0;
    }

    //Init World
    this.world.tileMap = this.world.maps[this.level-1];

    //Init Enemies 
    this.allEnemies = [];
    var numberOfEnemiesInLevel = this.numberOfEnemies * this.level; 
    for (var enemyIndex = this.allEnemies.length; enemyIndex < numberOfEnemiesInLevel ; enemyIndex++) {
        var enemy = new Enemy('images/enemy-bug.png');
        enemy.init(true); 
        this.allEnemies.push(enemy);
    }
    console.log(this.allEnemies);

    //Init Player 
    this.player.init();

    //Hide all extras
    this.extras.forEach(function(extra) {
        extra.draw = false;
    });

    //Init Princess
    this.princess = this.extras[this.level - 1];
    this.princess.init(this.world.getTilesOfType('x')[0]);

    this.running = 1;
};

Game.prototype.init = function(pixelDimensions, tileSize) {
    //world variable is filled by the data in engine.js
    //and used by the entities;
    this.world = new World();
    this.world.init(pixelDimensions, tileSize);

    this.numberOfEnemies = 6; 

    //Enemies are spawned when the game is started.
    this.allEnemies = [];

    this.player = new Player('images/char-boy.png');
    this.extras = []; 
    this.extras.push (new Actor('images/char-cat-girl.png'));
    this.extras.push (new Actor('images/char-pink-girl.png'));
    this.extras.push (new Actor('images/char-horn-girl.png'));
    this.extras.push (new Actor('images/char-princess-girl.png'));
    this.extras.push (new Actor('images/Heart.png'));
    this.startLevel(true);
};

//Checks collision
Game.prototype.checkCollisions = function()  {
    if (this.running === 1) { 
        //Collision boundary. Not really precise, but will do for 
        //this game
        var collisionZone = 50;
        this.allEnemies.forEach(function(enemy) {
            if ((Math.abs(enemy.x - this.player.x) < collisionZone) &&
                (Math.abs(enemy.y - this.player.y) < collisionZone)) {
                    //Reduces lives by one
                    this.lives--;
                    //Resets player to staring position
                    this.player.tileX = this.world.tileMap.playerStartTile.x;
                    this.player.tileY = this.world.tileMap.playerStartTile.y;
                }
        },this);
    }
    return false; 
}

//checks for winning conditions
Game.prototype.checkVictory = function()  {
    if (this.running === 1) { 
        var collisionZone = 50;
        if ((Math.abs(this.princess.x - this.player.x) < collisionZone) &&
                (Math.abs(this.princess.y - this.player.y) < collisionZone)) {
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

//checks for losing conditions
Game.prototype.checkDefeat = function()  {
    var result = false;
    if (this.lives === 0) {
        this.startLevel(true);
        result = true;
    }
    return result;
}



//End sequence. Not very flexible, but it's one-off
Game.prototype.victorySequence = function() {
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


