class Entity {
    constructor(x, y, sprite, speed, animated) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.speed = speed;
        this.animated = animated;
        this.tiled = false;
    }

    update(data) {}
}

class StaticPlatform extends Entity {
    constructor(x, y) {
        super(x, y, new TileSprite(24, 8, 3, 1), 0, false);
        this.tiled = true;
    }

    update(data) {}
}