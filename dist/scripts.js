"use strict";
class CanvasInstance {
    constructor() { }
    static getInstance() {
        return this.instance ? this.instance : this.getNewInstance();
    }
    static getNewInstance() {
        const body = document.getElementById("body");
        const bodyBoundingClientRect = body.getBoundingClientRect();
        const height = Math.ceil(bodyBoundingClientRect.height);
        const width = Math.ceil(bodyBoundingClientRect.width);
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
        const newFramesPerSecond = {
            fps: this.FPS,
            millisecondsPerFrame,
            minimumMillisecondsToRender,
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
        this.knight = new Knight();
        this.pauseControls = new PauseControls();
        this.pauseControls.clearPauseFlag();
        const keyboardControls = new KeyboardControls(() => {
            this.pauseControls.togglePaused();
        });
        keyboardControls.addKeyPressedDown();
    }
    enablePaused() {
        this.pauseControls.setPause(true);
    }
    resizeCanvas() {
        this.canvasInstance = CanvasInstance.getNewInstance();
    }
    renderFrame(timestamp) {
        if (!this.shouldRenderFrame(timestamp))
            return;
        const ctx = this.canvasInstance.canvasContext;
        ctx.clearRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        ctx.save();
        this.knight.drawAttack();
        // this.knight.drawIdle();
        ctx.restore();
    }
    shouldRenderFrame(timestamp) {
        if (timestamp === 0)
            return false;
        if (this.lastTimestamp === 0) {
            this.lastTimestamp = timestamp;
            return false;
        }
        const deltaTimeMilliseconds = Math.floor(timestamp - this.lastTimestamp);
        const framesPerSecond = FramesPerSecondInstance.getFramesPerSecond();
        const shouldRender = framesPerSecond.minimumMillisecondsToRender <= deltaTimeMilliseconds;
        if (shouldRender) {
            this.lastTimestamp = timestamp;
        }
        return shouldRender;
    }
}
class Knight {
    constructor() {
        this.WAIT_FOR_NEXT_RENDER_MILLISECONDS = 100;
        this.lastAnimationTimestamp = 0;
        this.currentFrame = 0;
        this.canvasInstance = CanvasInstance.getInstance();
        this.pauseControls = new PauseControls();
        const knightAnimations = new KnightAnimations();
        this.knightAnimationFrames = knightAnimations.getAnimations();
    }
    drawAttack() {
        const attackAnimation = this.knightAnimationFrames["attack"];
        this.draw(attackAnimation);
    }
    drawIdle() {
        const idleAnimation = this.knightAnimationFrames["idle"];
        this.draw(idleAnimation);
    }
    draw(animationFrame) {
        const currentTimestamp = Date.now();
        const shouldDrawNextFrame = this.WAIT_FOR_NEXT_RENDER_MILLISECONDS <=
            currentTimestamp - this.lastAnimationTimestamp;
        if (shouldDrawNextFrame && !this.pauseControls.isPaused()) {
            this.currentFrame++;
            this.lastAnimationTimestamp = currentTimestamp;
        }
        const frameToDraw = this.currentFrame % animationFrame.numberOfFrames;
        const ctx = this.canvasInstance.canvasContext;
        ctx.drawImage(animationFrame.imageSource, frameToDraw * animationFrame.frameWidth, 0, animationFrame.frameWidth, animationFrame.frameHeight, 0, 0, animationFrame.frameWidth, animationFrame.frameHeight);
    }
}
class KnightAnimations {
    constructor() {
        this.ASSET_FOLDER = "./dist/images/knight";
        this.SPRITE_WIDTH_PIXELS = 120;
        this.SPRITE_HEIGHT_PIXELS = 80;
    }
    getAnimations() {
        const attackAnimation = this.buildAnimationFrame("attack.png", 4);
        const idleAnimation = this.buildAnimationFrame("_Idle.png", 10);
        return {
            attack: attackAnimation,
            idle: idleAnimation,
        };
    }
    buildAnimationFrame(file, numberOfFrames) {
        const image = new Image();
        image.src = `${this.ASSET_FOLDER}/${file}`;
        return {
            imageSource: image,
            numberOfFrames: numberOfFrames,
            frameHeight: this.SPRITE_HEIGHT_PIXELS,
            frameWidth: this.SPRITE_WIDTH_PIXELS,
        };
    }
}
class KeyboardControls {
    constructor(togglePause) {
        this.togglePause = togglePause;
    }
    addKeyPressedDown() {
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    console.log("left");
                    break;
                case "ArrowRight":
                    console.log("right");
                    break;
                case "ArrowUp":
                    console.log("up");
                    break;
                case "ArrowDown":
                    console.log("down");
                    break;
                case "KeyP":
                    this.togglePause();
                    break;
            }
        });
    }
}
class PauseControls {
    constructor() {
        this.IS_PAUSED = "isPaused";
    }
    isPaused() {
        const isPaused = localStorage.getItem(this.IS_PAUSED) || 'false';
        return isPaused === 'true';
    }
    togglePaused() {
        const setPauseFlag = this.isPaused() ? "false" : "true";
        localStorage.setItem(this.IS_PAUSED, setPauseFlag);
        return this.isPaused();
    }
    setPause(isPaused) {
        localStorage.setItem(this.IS_PAUSED, isPaused ? "true" : "false");
        return this.isPaused();
    }
    clearPauseFlag() {
        localStorage.removeItem(this.IS_PAUSED);
    }
}
const platformer = new Platformer();
window.addEventListener("resize", () => {
    platformer.enablePaused();
    platformer.resizeCanvas();
});
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        platformer.enablePaused();
    }
});
function animate(timestamp) {
    platformer.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
animate(0);
