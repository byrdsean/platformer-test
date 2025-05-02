abstract class AbstractKnightState {
  protected knight: Knight;
  protected canvasInstance: Canvas;
  protected animation: AnimationFrame;
  protected pauseControls: PauseControls;

  protected currentFrame = 0;
  private lastAnimationTimestamp = 0;
  protected waitForNextRenderMilliseconds = 100;

  constructor(knight: Knight, animation: AnimationFrame) {
    this.knight = knight;
    
    this.animation = animation;
    this.knight.height = this.animation.frameHeight;
    this.knight.width = this.animation.frameWidth;

    this.canvasInstance = CanvasInstance.getInstance();
    this.pauseControls = new PauseControls();
  }

  abstract input(userInputs: UserInputModel): AbstractKnightState | null;
  abstract update(): AbstractKnightState | null;
  abstract exit(): void;

  enter() {
    this.knight.height = this.animation.frameHeight;
    this.knight.width = this.animation.frameWidth;
  }

  protected draw() {
    const frameToDraw = this.currentFrame % this.animation.numberOfFrames;
    const scaleContextModel = this.getScaleContextModel();

    if (this.shouldDrawNextFrame()) {
      this.currentFrame = ++this.currentFrame % this.animation.numberOfFrames;
    }

    const ctx = this.canvasInstance.canvasContext;
    ctx.save();

    ctx.scale(scaleContextModel.scaleX, scaleContextModel.scaleY);
    ctx.drawImage(
      this.animation.imageSource,
      frameToDraw * this.animation.frameWidth,
      0,
      this.animation.frameWidth,
      this.animation.frameHeight,
      scaleContextModel.xPosition,
      scaleContextModel.yPosition,
      this.animation.frameWidth,
      this.animation.frameHeight
    );

    ctx.restore();
  }

  protected isOnFloor(): boolean {
    const collidedObjects = CollisionInstance
      .getCollidableObjects()
      .filter(collidableObject => 
        CollisionInstance.areObjectsColliding(this.knight, collidableObject)
      );
    return collidedObjects.length !== 0;
  }

  private getScaleContextModel(): ScaleContextModel {
    const isFacingLeft =
      this.knight.horizontalFacingDirection == HorizontalMovementEnum.LEFT;
    const scaleX = isFacingLeft ? -1 : 1;
    const xOffset = isFacingLeft ? this.animation.frameWidth : 0;

    return {
      scaleX: scaleX,
      scaleY: 1,
      xPosition: (this.knight.horizontalPosition + xOffset) * scaleX,
      yPosition: this.knight.verticalPosition,
    };
  }

  private shouldDrawNextFrame(): boolean {
    if (this.pauseControls.isPaused()) return false;

    const currentTimestamp = Date.now();
    const shouldDrawNextFrame =
      this.waitForNextRenderMilliseconds <=
      currentTimestamp - this.lastAnimationTimestamp;

    if (shouldDrawNextFrame) {
      this.lastAnimationTimestamp = currentTimestamp;
    }

    return shouldDrawNextFrame;
  }
}
