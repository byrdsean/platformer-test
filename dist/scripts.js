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
        this.keyboardControls = new KeyboardControls(() => {
            this.pauseControls.togglePaused();
        });
        this.keyboardControls.addKeyPressedDown();
        this.keyboardControls.addKeyPressedUp();
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
        const interactiveComponent = InteractiveComponentInstance.getCurrentInteractiveComponent();
        const keyboardButtons = this.keyboardControls.getKeyboardInputs();
        interactiveComponent?.setInput(keyboardButtons);
        interactiveComponent?.draw();
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
        this.horizontalPosition = 0;
        this.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
        this.states = {
            idle: new IdleState(this),
            run: new RunState(this),
            attack: new AttackState(this),
        };
        this.currentState = this.states.idle;
    }
    setInput(userInputs) {
        const newState = this.currentState.input(userInputs);
        this.updateCurrentState(newState);
    }
    draw() {
        const newState = this.currentState.update();
        this.updateCurrentState(newState);
    }
    updateCurrentState(newState) {
        if (!newState)
            return;
        this.currentState = newState;
    }
}
class KnightAnimations {
    constructor() { }
    static getAttackAnimation() {
        return this.buildAnimationFrame("attack.png", 4);
    }
    static getIdleAnimation() {
        return this.buildAnimationFrame("idle.png", 10);
    }
    static getRunAnimation() {
        return this.buildAnimationFrame("run.png", 10);
    }
    static buildAnimationFrame(file, numberOfFrames) {
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
KnightAnimations.ASSET_FOLDER = "./dist/images/knight";
KnightAnimations.SPRITE_WIDTH_PIXELS = 120;
KnightAnimations.SPRITE_HEIGHT_PIXELS = 80;
class AbstractKnightState {
    constructor(knight, animation) {
        this.currentFrame = 0;
        this.lastAnimationTimestamp = 0;
        this.waitForNextRenderMilliseconds = 100;
        this.knight = knight;
        this.animation = animation;
        this.canvasInstance = CanvasInstance.getInstance();
        this.pauseControls = new PauseControls();
    }
    draw() {
        const frameToDraw = this.currentFrame % this.animation.numberOfFrames;
        const scaleContextModel = this.getScaleContextModel();
        if (this.shouldDrawNextFrame()) {
            this.currentFrame = ++this.currentFrame % this.animation.numberOfFrames;
        }
        const ctx = this.canvasInstance.canvasContext;
        ctx.save();
        ctx.scale(scaleContextModel.scaleX, scaleContextModel.scaleY);
        ctx.drawImage(this.animation.imageSource, frameToDraw * this.animation.frameWidth, 0, this.animation.frameWidth, this.animation.frameHeight, scaleContextModel.xPosition, scaleContextModel.yPosition, this.animation.frameWidth, this.animation.frameHeight);
        ctx.restore();
    }
    getScaleContextModel() {
        const isFacingLeft = this.knight.horizontalFacingDirection == HorizontalMovementEnum.LEFT;
        const scaleX = isFacingLeft ? -1 : 1;
        const xOffset = isFacingLeft ? this.animation.frameWidth : 0;
        return {
            scaleX: scaleX,
            scaleY: 1,
            xPosition: (this.knight.horizontalPosition + xOffset) * scaleX,
            yPosition: 0,
        };
    }
    shouldDrawNextFrame() {
        if (this.pauseControls.isPaused())
            return false;
        const currentTimestamp = Date.now();
        const shouldDrawNextFrame = this.waitForNextRenderMilliseconds <=
            currentTimestamp - this.lastAnimationTimestamp;
        if (shouldDrawNextFrame) {
            this.lastAnimationTimestamp = currentTimestamp;
        }
        return shouldDrawNextFrame;
    }
}
class AttackState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getAttackAnimation());
        this.startedAttack = false;
        this.waitForNextRenderMilliseconds = AttackState.WAIT_FOR_NEXT_RENDER_MILLISECONDS;
    }
    input(userInputs) {
        if (this.startedAttack && this.currentFrame == 0) {
            this.exit();
            return this.knight.states.idle;
        }
        return null;
    }
    update() {
        this.startedAttack = true;
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.startedAttack = false;
    }
}
AttackState.ANIMATION_NAME = "attack";
AttackState.WAIT_FOR_NEXT_RENDER_MILLISECONDS = 50;
class IdleState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getIdleAnimation());
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        if (userInputs.left || userInputs.right) {
            this.exit();
            return this.knight.states.run;
        }
        if (userInputs.attack) {
            this.exit();
            return this.knight.states.attack;
        }
        return null;
    }
    update() {
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
    }
}
IdleState.ANIMATION_NAME = "idle";
class RunState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getRunAnimation());
        this.HORIZONTAL_MOVEMENT_SPEED_PX = 3;
        this.horizontalMovement = HorizontalMovementEnum.NONE;
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        if (!userInputs.left && !userInputs.right && !userInputs.up && !userInputs.down) {
            this.exit();
            return this.knight.states.idle;
        }
        if (userInputs.left) {
            this.horizontalMovement = HorizontalMovementEnum.LEFT;
            this.knight.horizontalFacingDirection = HorizontalMovementEnum.LEFT;
        }
        else if (userInputs.right) {
            this.horizontalMovement = HorizontalMovementEnum.RIGHT;
            this.knight.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
        }
        if (userInputs.attack) {
            this.exit();
            return this.knight.states.attack;
        }
        return null;
    }
    update() {
        if (!this.pauseControls.isPaused()) {
            this.knight.horizontalPosition += this.getHorizontalPosDifference();
        }
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.horizontalMovement = HorizontalMovementEnum.NONE;
    }
    getHorizontalPosDifference() {
        switch (this.horizontalMovement) {
            case HorizontalMovementEnum.LEFT:
                return -this.HORIZONTAL_MOVEMENT_SPEED_PX;
            case HorizontalMovementEnum.RIGHT:
                return this.HORIZONTAL_MOVEMENT_SPEED_PX;
            default:
                return 0;
        }
    }
}
RunState.ANIMATION_NAME = "run";
class KeyboardControls {
    constructor(togglePause) {
        this.togglePause = togglePause;
        this.userInputModel = { up: false, down: false, left: false, right: false, attack: false };
    }
    getKeyboardInputs() {
        return this.userInputModel;
    }
    addKeyPressedDown() {
        window.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "KeyP":
                    this.togglePause();
                    break;
                case "ArrowLeft":
                    this.userInputModel = { ...this.userInputModel, left: true };
                    break;
                case "ArrowRight":
                    this.userInputModel = { ...this.userInputModel, right: true };
                    break;
                case "ArrowUp":
                    this.userInputModel = { ...this.userInputModel, up: true };
                    break;
                case "ArrowDown":
                    this.userInputModel = { ...this.userInputModel, down: true };
                    break;
                case "Space":
                    this.userInputModel = { ...this.userInputModel, attack: true };
                    break;
            }
        });
    }
    addKeyPressedUp() {
        window.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    this.userInputModel = { ...this.userInputModel, left: false };
                    break;
                case "ArrowRight":
                    this.userInputModel = { ...this.userInputModel, right: false };
                    break;
                case "ArrowUp":
                    this.userInputModel = { ...this.userInputModel, up: false };
                    break;
                case "ArrowDown":
                    this.userInputModel = { ...this.userInputModel, down: false };
                    break;
                case "Space":
                    this.userInputModel = { ...this.userInputModel, attack: false };
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
