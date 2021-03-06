/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;


    //Canvas width and height. 
    //Predefinite values be overridden when World is initialized, since maps will be bigger than this.
    canvas.width = 505;
    canvas.height = 606;


    //Variable used to store map dimensions, to be passed to entities
    //for boundaries checking
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();

        //Init world variable used to draw the map and update entitites
        var pixelDimensions = { width: canvas.width, height: canvas.height };
        var tileSize = { x: 101, y: 83 };

        //game is the global instance of the Game class defined in game.js
        game.init(pixelDimensions, tileSize);

        reset();
        main();
     }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        //Call utility function 
        updateEntities(dt);

        //Collision detection. Defined in game.js
        game.checkCollisions();

        //Checking for victory or defeat conditions, that will reset the state
        if (game.checkVictory() || game.checkDefeat()) {
            reset();
        }
    }

    /* 
     * Computes the collisions between the player and enemies 
     */
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        //Player update. 
        game.player.update(dt, game.world);

        //Goes through the whole allEnemy array and updates enemies one by one
        game.allEnemies.forEach(function(enemy) {
            enemy.update(dt, game.world);
        });
        
        //Extras. static characters
        game.princess.update(game.world);
        game.extras.forEach(function(extra) {
            extra.update(game.world);
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);

        //Number of rows and columns changes depending on the level number
        var numRows = game.world.tileMap.totalTiles.y;
        var numCols = game.world.tileMap.totalTiles.x;
        var row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                // Modified so that it reads the tileMap array in world.
                var resource;
                switch (game.world.tileMap.map[col + numCols*row])   {
                    case 'w':
                        resource = 'images/water-block.png';   
                        break;
                    case 'g':
                        resource = 'images/grass-block.png';   
                        break;
                    case 's':
                        resource = 'images/stone-block.png';   
                        break;
                    case 'x':
                        //For the goal tile we will draw the princess separately,
                        //above a grass tile
                        resource = 'images/grass-block.png';   
                        break;
                }
                ctx.drawImage(Resources.get(resource), col * game.world.tileSize.x, row * game.world.tileSize.y);
            }
        }

        renderEntities();
        renderTopBar();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        game.extras.forEach(function(extra) {
            extra.render();
        });

        game.player.render();
        game.princess.render();
    }

    //Called upon level change
    function reset() {

        //Updates canvas size depending on world size
        canvas.width  = 101 * game.world.tileMap.totalTiles.x;
        canvas.height = 101 * game.world.tileMap.totalTiles.y;
        var pixelDimensions = { width: canvas.width, height: canvas.height };
        //Updates world size 
        game.world.sizeInPixels.width = pixelDimensions.width;
        game.world.sizeInPixels.height = pixelDimensions.height;

    }
    /*
        Drawing the topbar
        I'm saving the context properties and restore them once drawn,
        to not mess up the rest of the render code for images 
    */
    function renderTopBar() {
        //Saving context
        ctx.save();
        //Transparency
        ctx.globalAlpha = 0.7; 
        //Text formatting
        ctx.font = '28px Impact'; 
        ctx.lineWidth = 1; 
        ctx.textAlign= 'start'; 
        ctx.strokeStyle = 'black'; 
        if (game.running){ 
        //Using the alignment options to render part of the text to the left
        //and the second part to the right
        var topBarTextLeft=  'Score: ' + game.score;
        ctx.strokeText(topBarTextLeft, 10 , 40);
        var topBarTextRight = 'Level: ' + game.level + ' Lives: ' + game.player.lives ;
        ctx.textAlign= 'end'; 
        ctx.strokeText(topBarTextRight, canvas.width - 10, 40);
        }else {
        //Using the alignment options to render part of the text to the left
        //and the second part to the right
        var topBarTextLeft=  'Score: ' + game.score;
        ctx.strokeText(topBarTextLeft, 10 , 40);
        }
        ctx.restore();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-princess-girl.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
