function randint(max) {
    return Math.floor(Math.random() * max);
}

function getStartingPlatforms() {
    let platforms = [];
    let platformCount = randint(12) + 10;
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new StaticPlatform(i * ((canvas.width * 1.5 - 48) / platformCount) + randint(15), randint(canvas.height / 2) + 50));
    }
    platforms.sort((a, b) => {
        if (a.x > b.x) return 1;
        else if (a.x == b.x) return 0;
        else return -1;
    });
    // reset prevTime and prevY
    prevTime = 0;
    prevY = 0;
    return platforms;
}

let prevTime;
let prevY;

function generateNext(speed, time) {
    if (time - prevTime < 1000) return;
    if (time - prevTime > 3500 * (speed / 20) || prevTime == 0) {
        prevTime = time;
        let platform = new StaticPlatform(canvas.width + randint(30), randint(canvas.height / 2) + 50);
        if (platform.y > prevY + 120 && prevY != 0) {
            platform.y = prevY + randint(60);
        }
        prevY = platform.y;
        return platform;
    }
}