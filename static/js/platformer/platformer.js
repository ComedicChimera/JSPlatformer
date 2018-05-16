// renderer
let canvas = document.getElementById('game-window');
let ctx = canvas.getContext('2d');

// renderer class
class Renderer {
    static floodScreen(color) {
        // set color
        ctx.fillStyle = color;

        // fill screen
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    static drawTime(time) {
        // derive time values
        let minutes = time.getMinutes(), seconds = time.getSeconds();

        // handle leading zeros
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // draw to screen
        ctx.fillText(`Time: ${minutes}:${seconds}`, canvas.width - 25, 25);
    }

    static drawMessage(msg, color) {
        // configure font
        ctx.font = '48px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';

        // draw text
        ctx.fillText(msg, canvas.width / 2, canvas.height / 2);

        // reset font configurations
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
    }

    static drawEntity(entity) {
        // handle animated entities
        if (entity.animated) {
            // get x coordinate
            let minX = entity.sprite.animate();

            // draw sprite selection
            ctx.drawImage(entity.sprite.animationSheet, minX, 0, entity.sprite.sizeX, entity.sprite.sizeY, 
                entity.x, canvas.height - (entity.y + entity.sprite.sizeY), entity.sprite.sizeX, entity.sprite.sizeY);
        // non animates sprites
        } else {
            // draw sprite
            ctx.drawImage(entity.sprite.image, entity.x, canvas.height - (entity.y + entity.sprite.sizeY));
        }
    }
}

// start up code
Renderer.floodScreen('#b2b2b2');

// draw start up message
Renderer.drawMessage('Press ENTER to Begin', 'black');

// add enter event handler
document.addEventListener('keydown', startGame);

// game init code
// control object
let playerControls = {
    left: false,
    right: false,
    jump: false
}

// player entity
let player = new Player(0, 0, canvas.width);

// time codes
let startTime;
let stopTime;

function startGame(ev) {
    if (ev.which == 13) {
        // add event listeners
        document.removeEventListener('keydown', startGame);

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

        // pause
        document.addEventListener('keydown', setPauseState);
        // setup start time
        startTime = Date.now();
        // start the game
        window.requestAnimationFrame(loop);
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
    // evaluate pause state
    if (!paused) {
        // next frame
        window.requestAnimationFrame(loop);
    } else {
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
    // update player
    player.update(playerControls);
    // draw player
    Renderer.drawEntity(player);
    // draw in the time
    Renderer.drawTime(new Date(Date.now() - startTime));
}