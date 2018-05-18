// get the canvas
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
        // reset color
        ctx.fillStyle = 'white';

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

    static drawDeathMessage() {
        // clear screen with light grey
        this.floodScreen("rgba(250, 125, 125, 0.5)");
        // write message to screen
        this.drawMessage('You Died.', 'white');
        // draw press enter message
        ctx.textAlign = 'center';
        ctx.fillText('Press ENTER to play again', canvas.width / 2, canvas.height / 2 + 38);

        ctx.textAlign = 'right';
    }

    static drawEntity(entity) {
        // handle animated entities
        if (entity.animated) {
            // get x coordinate
            let minX = entity.sprite.animate();

            // draw sprite selection
            ctx.drawImage(entity.sprite.animationSheet, minX, 0, entity.sprite.sizeX, entity.sprite.sizeY, 
                entity.x, canvas.height - (entity.y + entity.sprite.sizeY), entity.sprite.sizeX, entity.sprite.sizeY);
        
        }
        // tiles
        else if (entity.tiled) {
            // get the sprite sheet
            let image = new Image(624, 304);
            image.src = '../static/images/assets/platformer/tileset.png';

            // draw sprite region
            ctx.drawImage(image, entity.sprite.startX, entity.sprite.startY, entity.sprite.sizeX, entity.sprite.sizeY, 
                entity.x, canvas.height - (entity.y + entity.sprite.sizeY), entity.sprite.sizeX, entity.sprite.sizeY);
        }
        // non animates sprites
        else {
            // draw sprite
            ctx.drawImage(entity.sprite.image, entity.x, canvas.height - (entity.y + entity.sprite.sizeY));
        }
    }

    // display background
    static drawBackground() {
        let bgPath = '../static/images/assets/platformer/background/plx';
        // draw in the background fill
        this.floodScreen('#aedecb');
        // setup scale
        ctx.scale(2.3, 2.3);

        // set root offset
        let offset = this.backgroundOffset - 1;

        // draw each background layer
        for (var i = 0; i < 4; i++) {
            // bg image
            let bg = new Image(384, 216);

             // set path
            bg.src = bgPath + `-${i + 2}.png`;

             // display single image if possible
            if (offset == 0 || offset == canvas.width)
                ctx.drawImage(bg, 0, 0);
            else {
                // draw left image
                ctx.drawImage(bg, -offset, 0);
                // draw right image
                ctx.drawImage(bg, canvas.width / 2 - offset - 40, 0);
            }
        }

        // set offset
        this.backgroundOffset += gameSpeed;
        // reset offset
        if (offset >= canvas.width / 2 - 40) {
            this.backgroundOffset = 1 + gameSpeed;
        }

        // reset scale
        ctx.scale(10/23, 10/23);
    }

    static drawWater() {
        ctx.fillStyle = 'rgba(24, 73, 102, 0.5)';
        ctx.fillRect(0, canvas.height - 30, 848, 30);
    }
}

Renderer.backgroundOffset = 1;