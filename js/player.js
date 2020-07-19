class Player extends Entity {
    constructor(x, y, maxX) {
        super(x, y, new AnimatedSprite('character/idle-right.png', 38, 68, 12), 2, true);
        this.acc = 0;
        this.gravityAccumulator = 0;
        this.gravity = 0.002;
        this.maxX = maxX - this.sprite.sizeX;
        this.orientation = false;
        this.yBase = 0;
        this.alive = true;
    }

    update(controls) {
        this.animate(controls);
        // handle movement
        if (controls.left && this.x > 0)
            this.x -= this.speed;
        if (controls.right && this.x < this.maxX)
            this.x += this.speed;

        // handle jumping
        if (controls.jump && this.acc == 0)
            this.acc += 4;

        // handle jump stop
        if (this.acc == 0)
            this.gravityAccumulator = 0;

        // handle jump bottom
        else if (this.y < this.yBase) {
            this.acc = 0;
            this.y = this.yBase;
            this.gravityAccumulator = 0;
        }

        // handle jump continue
        else {
            this.gravityAccumulator += this.gravity;
            this.acc -= this.gravityAccumulator;
            this.y += this.acc;
        }

        // handle falling
        if (this.y > this.yBase && this.acc == 0)
            this.acc = -this.gravity;

        // handle death
        this.alive = this.y >= 10;
    }

    animate(controls) {
        if (controls.left != controls.right) {
            // update midair orientation
            if (controls.left)
                this.orientation = true;
            else if (controls.right)
                this.orientation = false;
        }
        // if in midair, add midair animation
        if (this.y > 40 + this.yBase && this.sprite.name != `character/midair-${this.orientation ? 'left' : 'right'}.png`) {
            this.sprite = new AnimatedSprite(`character/midair-${this.orientation ? 'left' : 'right'}.png`, 40, 70, 2);
            this.animated = true;
        }
        // decide between the two low ground animations
        else if (this.y > this.yBase) {
            // if it is going upward, jump
            if (this.acc > 0)
                this.sprite = new Sprite(`character/jump-${this.orientation ? 'left' : 'right'}.png`, 34, 68);
            // if it is going downward land
            else
                this.sprite = new Sprite(`character/landing-${this.orientation ? 'left' : 'right'}.png`, 40, 70);
            this.animated = false;
        }
        else {
            // if they are equal, there is no movement
            if (controls.left == controls.right && this.sprite.name != `character/idle-${this.orientation ? 'left' : 'right'}.png`)
                // set idle and lock orientation
                this.sprite = new AnimatedSprite(`character/idle-${this.orientation ? 'left' : 'right'}.png`, 38, 68, 12, 0);
            // handle any movement
            else if (this.sprite.name != `character/run-${this.orientation ? 'left' : 'right'}.png` && controls.left != controls.right)
                // set to running sprite
                this.sprite = new AnimatedSprite(`character/run-${this.orientation ? 'left' : 'right'}.png`, 42, 66, 8);
            this.animated = true;
        }
    }
}