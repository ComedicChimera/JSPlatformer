// start up code
Renderer.floodScreen('#b2b2b2');

// draw start up message
Renderer.drawMessage('Press ENTER to Begin', 'black');

// add enter event handler
document.addEventListener('keydown', startGame);

 // controls
document.addEventListener('keydown', (ev) => {
    switch (ev.which) {
        case 65:
            playerControls.left = true;
            break;
        case 68:
            playerControls.right = true;
            break;
        case 32:
            playerControls.jump = true; 
            break;
    }
});
document.addEventListener('keyup', (ev) => {
    switch (ev.which) {
        case 65:
            playerControls.left = false;
            break;
        case 68:
            playerControls.right = false;
            break;
        case 32:
            playerControls.jump = false;
            break;
    }
});

// game init code
// control object
let playerControls = {
    left: false,
    right: false,
    jump: false
}

// platforms
let entities;
// player entity
let player;

// time codes
let startTime;
let stopTime;

// speed of background
let gameSpeed;

function startGame(ev) {
    if (ev.which == 13) {
        // remove start game listener
        document.removeEventListener('keydown', startGame);

        // pause
        document.addEventListener('keydown', setPauseState);
        // setup start time
        startTime = Date.now();
        // start the game
        window.requestAnimationFrame(loop);
        // generate starting platforms
        entities = getStartingPlatforms();
        // setup player
        player = new Player(entities[2].x, entities[2].y + 20, canvas.width);
        // reset game speed
        gameSpeed = 1.1
    }
}

// game core logic
// whether or not screen is paused
let paused = false;

// game loop
function loop() {
    // begin by clearing screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // update
    update();
    // kill player
    if (!player.alive) {
        // send death message
        Renderer.drawDeathMessage();
        // remove event handlers
        document.removeEventListener('keydown', setPauseState);
        // add restart listener
        window.addEventListener('keydown', startGame);
    }
    // evaluate pause state
    else if (!paused) {
        // next frame
        window.requestAnimationFrame(loop);
    } 
    // handle pause message
    else {
        // clear screen with light grey
        Renderer.floodScreen("rgba(178, 178, 178, 0.5)");
        // write message to screen
        Renderer.drawMessage('Press Enter to continue', 'white');
        // collect stop time
        stopTime = Date.now();
    }
}

// pause / unpause the screen
function setPauseState(ev) {
    // set paused to true if not paused and player hit esc
    if (!paused && ev.which == 27)
        paused = true;
    // set paused to false if paused and player hit enter
    else if (paused && ev.which == 13) {
        paused = false;
        // update start time
        startTime = startTime + (Date.now() - stopTime);
        // restart game loop
        window.requestAnimationFrame(loop);
    }
}

// update function
function update() {
    // draw background
    Renderer.drawBackground();
    // draw water
    Renderer.drawWater();
    // default yBase
    player.yBase = 0;
    // platform player stood on
    let platform;
    // draw entities and update yBase
    for (var entity of entities) {
        Renderer.drawEntity(entity);
        if (entity.x - (player.sprite.sizeX - 10) < player.x && entity.x + entity.sprite.sizeX > player.x + 10 && player.y >= entity.y + player.acc) {
            if (entity.y + entity.sprite.sizeY > player.yBase) { 
                player.yBase = entity.y + entity.sprite.sizeY;
                platform = entity;
            }
        }
    }
    // update player
    player.update(playerControls);
    // draw player
    Renderer.drawEntity(player);
    // draw in the time
    Renderer.drawTime(new Date(Date.now() - startTime));
    // get start x if platform
    let startX = 0, startY = 0;
    if (platform) {
        startX = platform.x;
        startY = platform.y;
    }

    // apply entity transforms
    for (var i in entities) {
        // allow elements to removed during iteration
        if (i >= entities.length)
            break;
        if (entities[i] == platform)
            platform = entities[i];
        entities[i].x -= gameSpeed;
        // remove entities that exit the screen
        if (entities[i].x + entities[i].sprite.sizeX < 0) {
            if (entities.length > 1) {
                entities.splice(i, 1);
            }   
            else 
                entities = [];
        }
    }

    // apply entity movement to player standing moving platform
    if (player.y == player.yBase && player.yBase != 0 && player.x > gameSpeed) {
        player.x += platform.x - startX;
        player.y += platform.y - startY;
    }

    // add on next platform if necessary
    let nPlatform = generateNext(gameSpeed, Date.now() - startTime);
    
    if (nPlatform) entities.push(nPlatform);
}