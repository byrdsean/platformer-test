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
class Knight {
    constructor() {
        this.WAIT_FOR_NEXT_RENDER_MILLISECONDS = 100;
        this.lastAnimationTimestamp = 0;
        this.currentFrame = 0;
        this.canvasInstance = CanvasInstance.getInstance();
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
        const shouldDrawNextFrame = this.WAIT_FOR_NEXT_RENDER_MILLISECONDS <= currentTimestamp - this.lastAnimationTimestamp;
        if (shouldDrawNextFrame) {
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
        this.ASSET_FOLDER = "./dist/assets";
        this.SPRITE_WIDTH_PIXELS = 120;
        this.SPRITE_HEIGHT_PIXELS = 80;
    }
    getAnimations() {
        const attackAnimation = this.buildAnimationFrame("_Attack.png", 4);
        const idleAnimation = this.buildAnimationFrame("_Idle.png", 10);
        return {
            attack: attackAnimation,
            idle: idleAnimation
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
class Platformer {
    constructor() {
        this.lastTimestamp = 0;
        this.isPaused = false;
        this.canvasInstance = CanvasInstance.getInstance();
        this.knight = new Knight();
        const keyboardControls = new KeyboardControls(() => { this.togglePause(); });
        keyboardControls.addKeyPressedDown();
    }
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    enablePaused() {
        console.log("enablePaused");
        this.isPaused = true;
    }
    disablePaused() {
        console.log("disablePaused");
        this.isPaused = false;
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
        if (this.lastTimestamp === 0 || this.isPaused) {
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
const platformer = new Platformer();
function animate(timestamp) {
    platformer.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
animate(0);
window.addEventListener("resize", () => {
    platformer.enablePaused();
    platformer.resizeCanvas();
});
document.addEventListener("visibilitychange", (e) => {
    switch (document.visibilityState) {
        case "hidden":
            platformer.enablePaused();
            break;
        case "visible":
            // platformer.disablePaused();
            break;
    }
});
