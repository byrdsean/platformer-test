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
class CollisionInstance {
    constructor() { }
    static getCollidableObjects() {
        return this.collidableObjects;
    }
    static addCollidableObject(collidableObject) {
        this.collidableObjects = [...this.collidableObjects, collidableObject];
        return this.collidableObjects;
    }
    static areObjectsColliding(collidableObject1, collidableObject2) {
        const collisionDim1 = collidableObject1.getCollisionDimensions();
        const collisionDim2 = collidableObject2.getCollisionDimensions();
        if (collisionDim1.maxX < collisionDim2.minX) {
            return false;
        }
        if (collisionDim2.maxX < collisionDim1.minX) {
            return false;
        }
        if (collisionDim1.maxY < collisionDim2.minY) {
            return false;
        }
        if (collisionDim2.maxY < collisionDim1.minY) {
            return false;
        }
        return true;
    }
}
CollisionInstance.collidableObjects = [];
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
    constructor(horizontalFacingDirection) {
        this.jumpSpeed = 5;
        this.maxFallingSpeed = 5;
        this.gravity = 0.125;
        this.horizontalPosition = 0;
        this.verticalPosition = 0;
        this.horizontalMovementSpeed = 2;
        this.horizontalFacingDirection = horizontalFacingDirection;
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
        this.platforms = [
            new Platform(0, 200),
            new Platform(220, 200),
            new Platform(440, 200),
        ];
        this.platforms.forEach((platform) => CollisionInstance.addCollidableObject(platform));
        this.backgroundManager = new BackgroundManager();
        this.backgroundManager.addBackgroundLayer("layer-2.png", 2400, 720, 0.25);
        this.backgroundManager.addBackgroundLayer("layer-3.png", 2400, 720, 0.5);
        this.backgroundManager.addBackgroundLayer("layer-4.png", 2400, 720, 0.75);
        this.backgroundManager.addBackgroundLayer("layer-5.png", 2400, 720, 1);
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
        ctx.fillStyle = "lightblue";
        ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);
        this.backgroundManager.draw();
        this.platforms.forEach((platform) => {
            platform.draw();
        });
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
class Knight extends AbstractMoveableEntity {
    constructor() {
        super(HorizontalMovementEnum.RIGHT);
        this.height = 0;
        this.width = 0;
        this.states = {
            idle: new IdleState(this),
            run: new RunState(this),
            attack: new AttackState(this),
            fall: new FallState(this),
            jump: new JumpState(this),
        };
        this.currentState = this.states.idle;
        this.currentState.enter();
    }
    setInput(userInputs) {
        const newState = this.currentState.input(userInputs);
        this.updateCurrentState(newState);
    }
    draw() {
        const newState = this.currentState.update();
        this.updateCurrentState(newState);
    }
    getCollisionDimensions() {
        return {
            minX: this.horizontalPosition,
            minY: this.verticalPosition,
            maxX: this.horizontalPosition + this.width,
            maxY: this.verticalPosition + this.height
        };
    }
    updateCurrentState(newState) {
        if (!newState)
            return;
        this.currentState.exit();
        this.currentState = newState;
        this.currentState.enter();
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
    static getFallAnimation() {
        return this.buildAnimationFrame("fall.png", 3);
    }
    static getJumpAnimation() {
        return this.buildAnimationFrame("jump.png", 3);
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
class KnightHorizontalMovement {
    constructor(knight) {
        this.knight = knight;
        this.horizontalMovement = HorizontalMovementEnum.NONE;
    }
    setMovementLeft() {
        this.horizontalMovement = HorizontalMovementEnum.LEFT;
        this.knight.horizontalFacingDirection = HorizontalMovementEnum.LEFT;
    }
    setMovementRight() {
        this.horizontalMovement = HorizontalMovementEnum.RIGHT;
        this.knight.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
    }
    reset() {
        this.horizontalMovement = HorizontalMovementEnum.NONE;
    }
    getHorizontalMovement() {
        return this.horizontalMovement;
    }
    getHorizontalPosDifference() {
        switch (this.horizontalMovement) {
            case HorizontalMovementEnum.LEFT:
                return -this.knight.horizontalMovementSpeed;
            case HorizontalMovementEnum.RIGHT:
                return this.knight.horizontalMovementSpeed;
            default:
                return 0;
        }
    }
}
class AbstractKnightState {
    constructor(knight, animation) {
        this.currentFrame = 0;
        this.lastAnimationTimestamp = 0;
        this.waitForNextRenderMilliseconds = 100;
        this.knight = knight;
        this.animation = animation;
        this.knight.height = this.animation.frameHeight;
        this.knight.width = this.animation.frameWidth;
        this.canvasInstance = CanvasInstance.getInstance();
        this.pauseControls = new PauseControls();
    }
    enter() {
        this.knight.height = this.animation.frameHeight;
        this.knight.width = this.animation.frameWidth;
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
    isOnFloor() {
        const collidedObjects = CollisionInstance
            .getCollidableObjects()
            .filter(collidableObject => CollisionInstance.areObjectsColliding(this.knight, collidableObject));
        return collidedObjects.length !== 0;
    }
    getScaleContextModel() {
        const isFacingLeft = this.knight.horizontalFacingDirection == HorizontalMovementEnum.LEFT;
        const scaleX = isFacingLeft ? -1 : 1;
        const xOffset = isFacingLeft ? this.animation.frameWidth : 0;
        return {
            scaleX: scaleX,
            scaleY: 1,
            xPosition: (this.knight.horizontalPosition + xOffset) * scaleX,
            yPosition: this.knight.verticalPosition,
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
        this.waitForNextRenderMilliseconds =
            AttackState.WAIT_FOR_NEXT_RENDER_MILLISECONDS;
    }
    input(userInputs) {
        return null;
    }
    update() {
        if (this.startedAttack && this.currentFrame == 0) {
            return this.knight.states.idle;
        }
        this.startedAttack = true;
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.startedAttack = false;
    }
}
AttackState.WAIT_FOR_NEXT_RENDER_MILLISECONDS = 50;
class FallState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getFallAnimation());
        this.fallingSpeed = 0;
        this.knightHorizontalMovement = new KnightHorizontalMovement(knight);
        const canvasInstance = CanvasInstance.getInstance();
        this.gameHeight = canvasInstance.height;
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        if (userInputs.left) {
            this.knightHorizontalMovement.setMovementLeft();
        }
        else if (userInputs.right) {
            this.knightHorizontalMovement.setMovementRight();
        }
        return null;
    }
    update() {
        if (this.pauseControls.isPaused()) {
            this.draw();
            return null;
        }
        if (this.isOnFloor()) {
            console.log("FALL STATE: on floor");
            return this.knight.states.idle;
        }
        const lowerImageBound = this.getUpdatedVerticalPosition() + this.animation.frameHeight;
        if (lowerImageBound >= this.gameHeight) {
            const isIdle = this.knightHorizontalMovement.getHorizontalMovement() ==
                HorizontalMovementEnum.NONE;
            return isIdle ? this.knight.states.idle : this.knight.states.run;
        }
        this.knight.verticalPosition = this.getUpdatedVerticalPosition();
        this.knight.horizontalPosition +=
            this.knightHorizontalMovement.getHorizontalPosDifference();
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.fallingSpeed = this.knight.gravity;
        this.knightHorizontalMovement.reset();
    }
    getUpdatedVerticalPosition() {
        const frameLowerVerticalPos = this.knight.verticalPosition + this.animation.frameHeight;
        const distanceFromGameHeight = this.gameHeight - frameLowerVerticalPos;
        if (distanceFromGameHeight < this.fallingSpeed) {
            return this.knight.verticalPosition + distanceFromGameHeight;
        }
        const distanceToFall = this.knight.verticalPosition + this.fallingSpeed;
        this.fallingSpeed = Math.min(this.fallingSpeed + this.knight.gravity, this.knight.maxFallingSpeed);
        return distanceToFall;
    }
}
class IdleState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getIdleAnimation());
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        if (!this.isOnFloor()) {
            console.log("IDLE STATE: not on floor");
            return this.knight.states.fall;
        }
        if (userInputs.left || userInputs.right) {
            return this.knight.states.run;
        }
        if (userInputs.up) {
            return this.knight.states.jump;
        }
        if (userInputs.attack) {
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
class JumpState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getJumpAnimation());
        this.knightHorizontalMovement = new KnightHorizontalMovement(knight);
        this.jumpSpeed = this.knight.jumpSpeed;
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        if (userInputs.left) {
            this.knightHorizontalMovement.setMovementLeft();
        }
        else if (userInputs.right) {
            this.knightHorizontalMovement.setMovementRight();
        }
        return null;
    }
    update() {
        if (this.pauseControls.isPaused()) {
            this.draw();
            return null;
        }
        if (this.jumpSpeed <= 0) {
            return this.knight.states.fall;
        }
        this.knight.horizontalPosition +=
            this.knightHorizontalMovement.getHorizontalPosDifference();
        this.knight.verticalPosition -= this.jumpSpeed;
        this.jumpSpeed -= this.knight.gravity;
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.jumpSpeed = this.knight.jumpSpeed;
        this.knightHorizontalMovement.reset();
    }
}
class RunState extends AbstractKnightState {
    constructor(knight) {
        super(knight, KnightAnimations.getRunAnimation());
        this.knightHorizontalMovement = new KnightHorizontalMovement(knight);
    }
    input(userInputs) {
        if (this.pauseControls.isPaused()) {
            return null;
        }
        const areMovementInputsFalse = !userInputs.left &&
            !userInputs.right &&
            !userInputs.up &&
            !userInputs.down;
        if (areMovementInputsFalse) {
            return this.knight.states.idle;
        }
        if (userInputs.left) {
            this.knightHorizontalMovement.setMovementLeft();
        }
        else if (userInputs.right) {
            this.knightHorizontalMovement.setMovementRight();
        }
        if (userInputs.up) {
            return this.knight.states.jump;
        }
        if (userInputs.attack) {
            return this.knight.states.attack;
        }
        return null;
    }
    update() {
        if (!this.pauseControls.isPaused()) {
            this.knight.horizontalPosition +=
                this.knightHorizontalMovement.getHorizontalPosDifference();
        }
        this.draw();
        return null;
    }
    exit() {
        this.currentFrame = 0;
        this.knightHorizontalMovement.reset();
    }
}
class KeyboardControls {
    constructor(togglePause) {
        this.togglePause = togglePause;
        this.userInputModel = {
            up: false,
            down: false,
            left: false,
            right: false,
            attack: false,
        };
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
                    this.userInputModel.left = true;
                    break;
                case "ArrowRight":
                    this.userInputModel.right = true;
                    break;
                case "ArrowUp":
                    this.userInputModel.up = true;
                    break;
                case "ArrowDown":
                    this.userInputModel.down = true;
                    break;
                case "Space":
                    this.userInputModel.attack = true;
                    break;
            }
        });
    }
    addKeyPressedUp() {
        window.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "ArrowLeft":
                    this.userInputModel.left = false;
                    break;
                case "ArrowRight":
                    this.userInputModel.right = false;
                    break;
                case "ArrowUp":
                    this.userInputModel.up = false;
                    break;
                case "ArrowDown":
                    this.userInputModel.down = false;
                    break;
                case "Space":
                    this.userInputModel.attack = false;
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
class BackgroundLayer {
    constructor(imageSource, width, height, horizontalPosition, verticalPosition, speed) {
        this.height = height;
        this.width = width;
        this.horizontalPosition = horizontalPosition;
        this.verticalPosition = verticalPosition;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSource;
    }
    getHorizontalPosition() {
        return this.horizontalPosition;
    }
    getVerticalPosition() {
        return this.verticalPosition;
    }
    updateHorizontalPosition(delta) {
        this.horizontalPosition =
            this.horizontalPosition <= this.width * -1
                ? //Find the -x offset from 0 (number of pixels we need to place the image to the left of origin)
                    this.horizontalPosition + this.width
                : //Move the x position to the left (adjust gamespeed for speed modifier)
                    this.horizontalPosition - (delta * this.speed);
    }
}
class BackgroundManager {
    constructor() {
        this.backgroundLayers = [];
    }
    addBackgroundLayer(imageSource, width, height, speed) {
        const fullSource = `./dist/images/environment/${imageSource}`;
        const canvas = CanvasInstance.getInstance();
        const backgroundLayer = new BackgroundLayer(fullSource, width, height, 0, canvas.height - height, speed);
        this.backgroundLayers.push(backgroundLayer);
    }
    draw() {
        const { canvasContext: ctx, height, width } = CanvasInstance.getInstance();
        this.backgroundLayers.forEach(backgroundLayer => {
            const repetitions = Math.ceil(width / backgroundLayer.width) + 1;
            Array.from({ length: repetitions })
                .forEach((_, index) => {
                ctx.drawImage(backgroundLayer.image, backgroundLayer.getHorizontalPosition() + (backgroundLayer.width * index), backgroundLayer.getVerticalPosition());
            });
            backgroundLayer.updateHorizontalPosition(BackgroundManager.HORIZONTAL_DISTANCE_TO_MOVE);
        });
    }
}
BackgroundManager.HORIZONTAL_DISTANCE_TO_MOVE = 5;
class Platform extends AbstractMoveableEntity {
    constructor(horizontalPosition, verticalPosition) {
        super(HorizontalMovementEnum.NONE);
        this.canvasInstance = CanvasInstance.getInstance();
        this.animation = PlatformAnimations.getPlatformAnimation();
        this.horizontalPosition = horizontalPosition;
        this.verticalPosition = verticalPosition;
    }
    draw() {
        const ctx = this.canvasInstance.canvasContext;
        ctx.save();
        ctx.drawImage(this.animation.imageSource, 0, 0, this.animation.frameWidth, this.animation.frameHeight, this.horizontalPosition, this.verticalPosition, this.animation.frameWidth, this.animation.frameHeight);
        ctx.restore();
    }
    getCollisionDimensions() {
        return {
            minX: this.horizontalPosition,
            minY: this.verticalPosition,
            maxX: this.horizontalPosition + this.animation.frameWidth,
            maxY: this.verticalPosition + this.animation.frameHeight
        };
    }
}
class PlatformAnimations {
    constructor() { }
    static getPlatformAnimation() {
        return this.buildAnimationFrame("platform.png", 1, 120, 56);
    }
    static buildAnimationFrame(file, numberOfFrames, frameWidth, frameHeight) {
        const image = new Image();
        image.src = `${this.ASSET_FOLDER}/${file}`;
        return {
            imageSource: image,
            numberOfFrames: numberOfFrames,
            frameHeight: frameHeight,
            frameWidth: frameWidth,
        };
    }
}
PlatformAnimations.ASSET_FOLDER = "./dist/images/environment";
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
