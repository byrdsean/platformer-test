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
class InteractiveComponentInstance {
    constructor() { }
    static getCurrentInteractiveComponent() {
        return this.currentInteractiveComponent;
    }
    static setCurrentInteractiveComponent(currentInteractiveComponent) {
        this.previousInteractiveComponent = this.currentInteractiveComponent;
        this.currentInteractiveComponent = currentInteractiveComponent;
    }
}
class AbstractMoveableEntity {
    constructor() {
        this.horizontalMovement = HorizontalMovementEnum.NONE;
        this.verticalMovement = VerticalMovementEnum.NONE;
    }
    keydownVertical(movement) {
        this.verticalMovement = movement;
    }
    keydownHorizontal(movement) {
        this.horizontalMovement = movement;
    }
    keyupVertical() {
        this.verticalMovement = VerticalMovementEnum.NONE;
    }
    keyupHorizontal() {
        this.horizontalMovement = HorizontalMovementEnum.NONE;
    }
}
var HorizontalMovementEnum;
(function (HorizontalMovementEnum) {
    HorizontalMovementEnum[HorizontalMovementEnum["NONE"] = 0] = "NONE";
    HorizontalMovementEnum[HorizontalMovementEnum["LEFT"] = 1] = "LEFT";
    HorizontalMovementEnum[HorizontalMovementEnum["RIGHT"] = 2] = "RIGHT";
})(HorizontalMovementEnum || (HorizontalMovementEnum = {}));
var VerticalMovementEnum;
(function (VerticalMovementEnum) {
    VerticalMovementEnum[VerticalMovementEnum["NONE"] = 0] = "NONE";
    VerticalMovementEnum[VerticalMovementEnum["UP"] = 1] = "UP";
    VerticalMovementEnum[VerticalMovementEnum["DOWN"] = 2] = "DOWN";
})(VerticalMovementEnum || (VerticalMovementEnum = {}));
class Platformer {
    constructor() {
        this.lastTimestamp = 0;
        this.canvasInstance = CanvasInstance.getInstance();
        this.knight = new Knight();
        InteractiveComponentInstance.setCurrentInteractiveComponent(this.knight);
        this.pauseControls = new PauseControls();
        this.pauseControls.clearPauseFlag();
        const keyboardControls = new KeyboardControls(() => {
            this.pauseControls.togglePaused();
        });
        keyboardControls.addKeyPressedDown();
        keyboardControls.addKeyPressedUp();
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
        this.knight.draw();
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
class Knight extends AbstractMoveableEntity {
    constructor() {
        super();
        this.WAIT_FOR_NEXT_RENDER_MILLISECONDS = 100;
        this.HORIZONTAL_MOVEMENT_SPEED_PX = 3;
        this.lastAnimationTimestamp = 0;
        this.currentFrame = 0;
        this.horizontalPosition = 0;
        this.canvasInstance = CanvasInstance.getInstance();
        this.pauseControls = new PauseControls();
        this.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
        const knightAnimations = new KnightAnimations();
        this.knightAnimationFrames = knightAnimations.getAnimations();
    }
    draw() {
        const animationName = this.horizontalMovement == HorizontalMovementEnum.NONE ? "idle" : "run";
        const animation = this.knightAnimationFrames[animationName];
        this.drawAnimation(animation);
    }
    keydownHorizontal(movement) {
        super.keydownHorizontal(movement);
        if (movement == HorizontalMovementEnum.LEFT ||
            movement == HorizontalMovementEnum.RIGHT) {
            this.horizontalFacingDirection = movement;
        }
    }
    drawAnimation(animationFrame) {
        const frameToDraw = this.currentFrame % animationFrame.numberOfFrames;
        const scaleAxis = this.getScaleXAxis(animationFrame.frameWidth);
        if (!this.pauseControls.isPaused()) {
            this.horizontalPosition += this.getHorizontalPixelsToMove();
            this.updateNextFrameToDraw(animationFrame.numberOfFrames);
        }
        const ctx = this.canvasInstance.canvasContext;
        ctx.save();
        ctx.scale(scaleAxis.scaleX, scaleAxis.scaleY);
        ctx.drawImage(animationFrame.imageSource, frameToDraw * animationFrame.frameWidth, 0, animationFrame.frameWidth, animationFrame.frameHeight, scaleAxis.xPosition, scaleAxis.yPosition, animationFrame.frameWidth, animationFrame.frameHeight);
        ctx.restore();
    }
    getScaleXAxis(frameWidth) {
        const isFacingLeft = this.horizontalFacingDirection == HorizontalMovementEnum.LEFT;
        const scaleX = isFacingLeft ? -1 : 1;
        const xOffset = isFacingLeft ? frameWidth : 0;
        return {
            scaleX: scaleX,
            scaleY: 1,
            xPosition: (this.horizontalPosition + xOffset) * scaleX,
            yPosition: 0,
        };
    }
    updateNextFrameToDraw(numberOfFrames) {
        const currentTimestamp = Date.now();
        const shouldDrawNextFrame = this.WAIT_FOR_NEXT_RENDER_MILLISECONDS <=
            currentTimestamp - this.lastAnimationTimestamp;
        if (!shouldDrawNextFrame)
            return;
        this.currentFrame = ++this.currentFrame % numberOfFrames;
        this.lastAnimationTimestamp = currentTimestamp;
    }
    getHorizontalPixelsToMove() {
        if (this.horizontalMovement == HorizontalMovementEnum.LEFT) {
            return -this.HORIZONTAL_MOVEMENT_SPEED_PX;
        }
        else if (this.horizontalMovement == HorizontalMovementEnum.RIGHT) {
            return this.HORIZONTAL_MOVEMENT_SPEED_PX;
        }
        else {
            return 0;
        }
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
        const runAnimation = this.buildAnimationFrame("_Run.png", 10);
        return {
            attack: attackAnimation,
            idle: idleAnimation,
            run: runAnimation,
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
            const currentComponent = InteractiveComponentInstance.getCurrentInteractiveComponent();
            switch (e.code) {
                case "ArrowLeft":
                    currentComponent?.keydownHorizontal(HorizontalMovementEnum.LEFT);
                    break;
                case "ArrowRight":
                    currentComponent?.keydownHorizontal(HorizontalMovementEnum.RIGHT);
                    break;
                case "ArrowUp":
                    currentComponent?.keydownVertical(VerticalMovementEnum.UP);
                    break;
                case "ArrowDown":
                    currentComponent?.keydownVertical(VerticalMovementEnum.DOWN);
                    break;
                case "KeyP":
                    this.togglePause();
                    break;
            }
        });
    }
    addKeyPressedUp() {
        window.addEventListener("keyup", (e) => {
            const currentComponent = InteractiveComponentInstance.getCurrentInteractiveComponent();
            switch (e.code) {
                case "ArrowLeft":
                case "ArrowRight":
                    currentComponent?.keyupHorizontal();
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    currentComponent?.keyupVertical();
                    break;
            }
        });
    }
}
class PauseControls {
    constructor() {
        this.IS_PAUSED = "isPaused";
        this.FALSE = "false";
        this.TRUE = "true";
    }
    isPaused() {
        const isPaused = localStorage.getItem(this.IS_PAUSED) || this.FALSE;
        return isPaused === this.TRUE;
    }
    togglePaused() {
        const setPauseFlag = this.isPaused() ? this.FALSE : this.TRUE;
        localStorage.setItem(this.IS_PAUSED, setPauseFlag);
        return this.isPaused();
    }
    setPause(isPaused) {
        localStorage.setItem(this.IS_PAUSED, isPaused ? this.TRUE : this.FALSE);
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
window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        platformer.enablePaused();
    }
});
function animate(timestamp) {
    platformer.renderFrame(timestamp);
    requestAnimationFrame(animate);
}
animate(0);
