export function createTimer(scene, duration, callback) {
    let timer = scene.time.delayedCall(duration, callback, [], scene);
    return timer;
}

export function addScore(scene, points) {
    scene.score += points;
    scene.scoreText.setText(`Очки: ${scene.score}`);
}
