class Entity {
    constructor(x, y, sprite, speed, animated, tiled=false) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.speed = speed;
        this.animated = animated;
        this.tiled = tiled;
    }

    update(data) {}
}

class StaticPlatform extends Entity {
    constructor(x, y, speed=0) {
        super(x, y, new TileSprite(24, 8, 3, 1), speed, false, true);
    }

    update(data) {}
}

class VerticalPlatform extends StaticPlatform {
    constructor(x, y) {
        super(x, y + 50, 0.5);
        this.up = true;
        this.origin = this.y;
    }

    update(data) {
        if (Math.abs(this.y - this.origin) > 50) {
            this.up = !this.up;
        } 
        if (this.up) {
            this.y += this.speed;
        }
        else {
            this.y -= this.speed;
        }
    }
}

class HorizontalPlatform extends StaticPlatform {
    constructor(x, y) {
        super(x, y, 1);
        this.right = true;
        this.offsetTimes = 0;
    }

    update(data) {
        if (this.offsetTimes > 120) {
            this.right = !this.right;
            this.offsetTimes = 0;
        } 
        if (this.right) {
            this.x += this.speed;
        }
        else {
            this.x -= this.speed;
        }
        this.offsetTimes++;
    }
}

class FallingPlatform extends Entity {
    constructor(x, y) {
        super(x, y, new TileSprite(21, 12, 3, 1), 2, false, true);
        this.timeStanding = 0;
        this.falling = false;
    }

    update(playerContact) {
        // detect falling
        if (this.timeStanding > 15) {
            this.falling = true;
        }

        // facillitate falling
        if (this.falling) {
            this.y -= this.speed;
            this.speed *= 1.2;
            if (this.y + this.sprite.sizeY < 0)
                this.x = -200;
        }
        // count up until falling
        else {
            if (playerContact) this.timeStanding++;
        }
    }
}

class BouncyPlatform extends Entity {
    constructor(x, y) {
        super(x, y, new TileSprite(4, 12, 3, 1), 2, false, true);
    }

    update(playerContact) {
        // bounce player
        if (player.acc == 0 && playerContact)
            player.acc += 25;
    }
}