/*
    
  Main app code 

  Architecture overwiew: the main class (using pseudoclassical pattern) is Game
  Game has a World (defining map topology) a Player, an array of Enemy(s) and a 
  princess which is an instance of the general class Actor for the characters
  of which Player and Enemy are subclasses
 
  Game holds the logic for checking collisions and victory/defeat conditions 
  The only variable in the global scope is game

  The code is organized as follows:
    - app.js: main game object initialization and keyboard input callback
    - game.js: defines Game class, managing game start and ending, and collision detection
    - actor.js: defines the generic Actor class for representing characters, and the subclasses
        Player and Enemy that are specific to those entities.
    - world.js: defines  World class, which manages map definitions and building.
    - engine.js basic game engine provided, modified to support the propietary code */

game = new Game();

/* This callback listens for key presses and sends the keys to the
   Player.handleInput() method.  */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (game.running) {
        game.player.handleInput(allowedKeys[e.keyCode]);
    }
});
