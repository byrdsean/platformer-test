class Knight extends AbstractMoveableEntity {
  private readonly WAIT_FOR_NEXT_RENDER_MILLISECONDS = 100;
  private readonly HORIZONTAL_MOVEMENT_SPEED_PX = 3;

  private lastAnimationTimestamp = 0;
  private currentFrame = 0;
  private horizontalPosition = 0;

  private canvasInstance: Canvas;
  private knightAnimationFrames: KnightAnimationFrames;
  private pauseControls: PauseControls;
  private horizontalFacingDirection: HorizontalMovementEnum;

  constructor() {
    super();

    this.canvasInstance = CanvasInstance.getInstance();
    this.pauseControls = new PauseControls();
    this.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;

    const knightAnimations = new KnightAnimations();
    this.knightAnimationFrames = knightAnimations.getAnimations();
  }

  draw() {
    const animationName =
      this.horizontalMovement == HorizontalMovementEnum.NONE ? "idle" : "run";
    const animation = this.knightAnimationFrames[animationName];
    this.drawAnimation(animation);
  }

  override keydownHorizontal(movement: HorizontalMovementEnum) {
    super.keydownHorizontal(movement);

    if (
      movement == HorizontalMovementEnum.LEFT ||
      movement == HorizontalMovementEnum.RIGHT
    ) {
      this.horizontalFacingDirection = movement;
    }
  }

  private drawAnimation(animationFrame: AnimationFrame) {
    const frameToDraw = this.currentFrame % animationFrame.numberOfFrames;
    const scaleAxis = this.getScaleXAxis(animationFrame.frameWidth);

    if (!this.pauseControls.isPaused()) {
      this.horizontalPosition += this.getHorizontalPixelsToMove();
      this.updateNextFrameToDraw(animationFrame.numberOfFrames);
    }

    const ctx = this.canvasInstance.canvasContext;
    ctx.save();

    ctx.scale(scaleAxis.scaleX, scaleAxis.scaleY);
    ctx.drawImage(
      animationFrame.imageSource,
      frameToDraw * animationFrame.frameWidth,
      0,
      animationFrame.frameWidth,
      animationFrame.frameHeight,
      scaleAxis.xPosition,
      scaleAxis.yPosition,
      animationFrame.frameWidth,
      animationFrame.frameHeight
    );

    ctx.restore();
  }

  private getScaleXAxis(frameWidth: number): ScaleContextModel {
    const isFacingLeft =
      this.horizontalFacingDirection == HorizontalMovementEnum.LEFT;
    const scaleX = isFacingLeft ? -1 : 1;
    const xOffset = isFacingLeft ? frameWidth : 0;

    return {
      scaleX: scaleX,
      scaleY: 1,
      xPosition: (this.horizontalPosition + xOffset) * scaleX,
      yPosition: 0,
    };
  }

  private updateNextFrameToDraw(numberOfFrames: number) {
    const currentTimestamp = Date.now();
    const shouldDrawNextFrame =
      this.WAIT_FOR_NEXT_RENDER_MILLISECONDS <=
      currentTimestamp - this.lastAnimationTimestamp;

    if (!shouldDrawNextFrame) return;

    this.currentFrame = ++this.currentFrame % numberOfFrames;
    this.lastAnimationTimestamp = currentTimestamp;
  }

  private getHorizontalPixelsToMove(): number {
    if (this.horizontalMovement == HorizontalMovementEnum.LEFT) {
      return -this.HORIZONTAL_MOVEMENT_SPEED_PX;
    } else if (this.horizontalMovement == HorizontalMovementEnum.RIGHT) {
      return this.HORIZONTAL_MOVEMENT_SPEED_PX;
    } else {
      return 0;
    }
  }
}
