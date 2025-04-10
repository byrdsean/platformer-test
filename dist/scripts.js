"use strict";
class CanvasInstance {
    constructor() { }
    static getInstance() {
        return this.instance ? this.instance : this.getNewInstance();
    }
    static getNewInstance() {
        const body = document.getElementById("body");
        const bodyBoundingClientRect = body.getBoundingClientRect();
        const height = Math.floor(bodyBoundingClientRect.height);
        const width = Math.floor(bodyBoundingClientRect.width);
        const gameScreen = document.getElementById(CanvasInstance.GAME_SCREEN_ID);
        gameScreen.height = height;
        gameScreen.width = width;
        this.instance = {
            canvasContext: gameScreen.getContext("2d"),
            height: height,
            width: width,
        };
        return this.instance;
    }
}
CanvasInstance.GAME_SCREEN_ID = "game_screen";
class FramesPerSecondInstance {
    constructor() { }
    static getFramesPerSecond() {
        if (this.framesPerSecond)
            return this.framesPerSecond;
        const millisecondsPerFrame = 1000 / FramesPerSecondInstance.FPS;
        const minimumMillisecondsToRender = Math.floor(millisecondsPerFrame) - 1;
        const maximumMillisecondsToRender = Math.ceil(millisecondsPerFrame) + 1;
        const newFramesPerSecond = {
            fps: this.FPS,
            millisecondsPerFrame,
            minimumMillisecondsToRender,
            maximumMillisecondsToRender,
        };
        this.framesPerSecond = newFramesPerSecond;
        return newFramesPerSecond;
    }
}
FramesPerSecondInstance.FPS = 60;
class Platformer {
    constructor() {
        this.lastTimestamp = 0;
        this.canvasInstance = CanvasInstance.getInstance();
        this.squareHeight = 0;
    }
    renderFrame() {
        const ctx = this.canvasInstance.canvasContext;
        ctx.clearRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(0, this.squareHeight++, 20, 20);
        ctx.restore();
    }
    shouldRender(timestamp) {
        const framesPerSecond = FramesPerSecondInstance.getFramesPerSecond();
        const millisecondsSinceLastRequest = Math.floor(timestamp - this.lastTimestamp);
        this.lastTimestamp = timestamp;
        return (framesPerSecond.minimumMillisecondsToRender <=
            millisecondsSinceLastRequest &&
            millisecondsSinceLastRequest <=
                framesPerSecond.maximumMillisecondsToRender);
    }
    resizeCanvas() {
        this.canvasInstance = CanvasInstance.getNewInstance();
    }
}
const platformer = new Platformer();
function animate(timestamp) {
    if (platformer.shouldRender(timestamp)) {
        platformer.renderFrame();
    }
    requestAnimationFrame(animate);
}
animate(0);
window.addEventListener("resize", () => {
    platformer.resizeCanvas();
});
