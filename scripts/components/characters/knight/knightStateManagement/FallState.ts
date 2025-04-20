class FallState extends AbstractKnightState {
  private horizontalMovement: HorizontalMovementEnum;
  private gameHeight: number;
  private fallingSpeed: number;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getFallAnimation());

    const canvasInstance = CanvasInstance.getInstance();
    this.gameHeight = canvasInstance.height;

    this.fallingSpeed = knight.gravity;
    this.horizontalMovement = HorizontalMovementEnum.NONE;
  }

  override input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      return null;
    }

    const lowerImageBound =
      this.getUpdatedVerticalPosition() + this.animation.frameHeight;

    if (lowerImageBound >= this.gameHeight) {
      return this.knight.states.idle;
    }

    if (userInputs.left) {
      this.horizontalMovement = HorizontalMovementEnum.LEFT;
      this.knight.horizontalFacingDirection = HorizontalMovementEnum.LEFT;
    } else if (userInputs.right) {
      this.horizontalMovement = HorizontalMovementEnum.RIGHT;
      this.knight.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
    }

    return null;
  }

  override update(): AbstractKnightState | null {
    if (!this.pauseControls.isPaused()) {
      this.knight.verticalPosition = this.getUpdatedVerticalPosition();
      this.knight.horizontalPosition += this.getHorizontalPosDifference();
    }
    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
    this.fallingSpeed = this.knight.gravity;
  }

  private getUpdatedVerticalPosition(): number {
    const frameLowerVerticalPos =
      this.knight.verticalPosition + this.animation.frameHeight;
    const distanceFromGameHeight = this.gameHeight - frameLowerVerticalPos;

    if (distanceFromGameHeight < this.fallingSpeed) {
      return this.knight.verticalPosition + distanceFromGameHeight;
    }

    const distanceToFall = this.knight.verticalPosition + this.fallingSpeed;

    this.fallingSpeed = Math.min(
      this.fallingSpeed + this.knight.fallingAcceleration,
      this.knight.terminalVelocity
    );

    return distanceToFall;
  }

  private getHorizontalPosDifference(): number {
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
