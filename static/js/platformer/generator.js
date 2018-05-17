function randint(max) {
    return Math.floor(Math.random() * max);
}

function getStartingPlatforms() {
    let platforms = [];
    let platformCount = randint(5) + 4;
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new StaticPlatform(i * ((canvas.width - 48) / platformCount) + randint(15), randint(canvas.height / 2) + 50));
    }
    platforms.sort((a, b) => {
        if (a.x > b.x) return 1;
        else if (a.x == b.x) return 0;
        else return -1;
    });
    return platforms;
}

let previousGenTime = 0;

function generateNext(speed, time) {
    if (randint(1600 * (speed * 0.05)) < 1 || time - previousGenTime > 4000 / (speed / 1.2)) {
        previousGenTime = time;
        return new StaticPlatform(canvas.width - 60, randint(canvas.height / 2) + 50);
    }
}