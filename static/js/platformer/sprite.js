// revise for release
const ASSET_PATH = '../../static/images/assets/platformer/';

class Sprite {
    constructor(name, sizeX, sizeY) {
        this.image = new Image(sizeX, sizeY);
        this.image.src = ASSET_PATH + name;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
}

class AnimatedSprite {
    constructor(name, sizeX, sizeY, frames) {
        this.name = name; // for controls and animation management
        this.animationSheet = new Image(sizeX * frames, sizeY);
        this.animationSheet.src = ASSET_PATH + name;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.frameCount = frames;
        this.animationCounter = 0;
    }

    // shifts the animation counter and returns a set of x coordinates to draw from on the sprite sheet
    animate() {
        // calculate to starting point of the sheet
        let minX = this.sizeX * Math.floor(this.animationCounter);
        // increment animation counter
        if (this.animationCounter == this.frameCount - 1)
            this.animationCounter = 0;
        else
            this.animationCounter += 0.25;
        // return minimum value
        return minX;
    }
}