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
class Knight {
    constructor() {
        this.currentFrame = 0;
        this.canvasInstance = CanvasInstance.getInstance();
    }
    drawAttack() {
        const attackAnimation = KnightAnimation.animations["attack"];
        this.draw(attackAnimation);
    }
    drawIdle() {
        const idleAnimation = KnightAnimation.animations["idle"];
        this.draw(idleAnimation);
    }
    draw(animationFrame) {
        const frameToDraw = this.currentFrame++ % animationFrame.numberOfFrames;
        const sprite = new Image();
        sprite.src = animationFrame.imageSource;
        const ctx = this.canvasInstance.canvasContext;
        ctx.drawImage(sprite, frameToDraw * animationFrame.frameWidth, 0, animationFrame.frameWidth, animationFrame.frameHeight, 0, 0, animationFrame.frameWidth, animationFrame.frameHeight);
    }
}
class KnightAnimation {
    constructor() { }
}
KnightAnimation.ASSET_FOLDER = "./dist/assets";
KnightAnimation.SPRITE_WIDTH_PIXELS = 120;
KnightAnimation.SPRITE_HEIGHT_PIXELS = 80;
KnightAnimation.animations = {
    attack: {
        imageSource: `${KnightAnimation.ASSET_FOLDER}/_Attack.png`,
        numberOfFrames: 4,
        frameHeight: KnightAnimation.SPRITE_HEIGHT_PIXELS,
        frameWidth: KnightAnimation.SPRITE_WIDTH_PIXELS,
    },
    idle: {
        imageSource: `${KnightAnimation.ASSET_FOLDER}/_Idle.png`,
        numberOfFrames: 10,
        frameHeight: KnightAnimation.SPRITE_HEIGHT_PIXELS,
        frameWidth: KnightAnimation.SPRITE_WIDTH_PIXELS,
    },
};
class Platformer {
    constructor() {
        this.lastTimestamp = 0;
        this.squareHeight = 0;
        this.canvasInstance = CanvasInstance.getInstance();
        this.knight = new Knight();
    }
    renderFrame() {
        const ctx = this.canvasInstance.canvasContext;
        ctx.clearRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.save();
        this.knight.drawAttack();
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
