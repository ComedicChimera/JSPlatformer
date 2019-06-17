function randint(max) {
    return Math.floor(Math.random() * max);
}

function getStartingPlatforms() {
    let platforms = [];
    let platformCount = randint(10) + 8;
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new StaticPlatform(i * ((canvas.width - 48) / platformCount) + randint(15), randint(canvas.height / 2) + 50));
    }
    platforms.sort((a, b) => {
        if (a.x > b.x) return 1;
        else if (a.x == b.x) return 0;
        else return -1;
    });
    // reset prevTime and prevY
    prevTime = 0;
    prevY = 0;
    popularity = 5;
    return platforms;
}

let prevTime;
let prevY;

function generateNext(speed, time) {
    if (time - prevTime < 1000) return;
    if (time - prevTime > 5000 * (speed / 20) || prevTime == 0) {
        prevTime = time;
        let platform = selectPlatform(speed);
        if (platform.y > prevY + 120 && prevY != 0) {
            platform.y = prevY + randint(60);
        }
        prevY = platform.y;
        return platform;
    }
}

// determines how often to spawn special platforms
let popularity;

function selectPlatform(speed) {
    // update popularity
    if (speed > 6)
        popularity = 3;
    if (speed > 4.2)
        popularity = 4;

    // select platforms
    if (speed > 3.2 && randint(popularity + 1) == 0)
        return new HorizontalPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
    if (speed > 2.5 && randint(popularity) == 0)
        return new VerticalPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
    if (speed > 1.9 && randint(popularity) == 0)
        return new BouncyPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
    if (speed > 1.5 && randint(popularity - 2) == 0)
        return new FallingPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
    else return new StaticPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
}