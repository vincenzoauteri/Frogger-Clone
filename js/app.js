//Main app code 

//Architecture overwiew: the main class (using pseudoclassical pattern) is Game
//Game has a World (defining map topology) a Player, an array of Enemy(s) and a 
//princess which is an instance of the general class Actor for the characters
//of which Player and Enemy are subclasses
//
//Game holds the logic for checking collisions and victory/defeat conditions
//The only variable in the global scope is game
game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
