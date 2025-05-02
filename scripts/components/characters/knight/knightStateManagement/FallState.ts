class FallState extends AbstractKnightState {
  private readonly knightHorizontalMovement: KnightHorizontalMovement;
  private gameHeight: number;
  private fallingSpeed = 0;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getFallAnimation());

    this.knightHorizontalMovement = new KnightHorizontalMovement(knight);

    const canvasInstance = CanvasInstance.getInstance();
    this.gameHeight = canvasInstance.height;
  }

  override input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      return null;
    }

    if (userInputs.left) {
      this.knightHorizontalMovement.setMovementLeft();
    } else if (userInputs.right) {
      this.knightHorizontalMovement.setMovementRight();
    }

    return null;
  }

  override update(): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      this.draw();
      return null;
    }

    if (this.isOnFloor()) {
      console.log("FALL STATE: on floor");
      return this.knight.states.idle;
    }

    const lowerImageBound =
      this.getUpdatedVerticalPosition() + this.animation.frameHeight;

    if (lowerImageBound >= this.gameHeight) {
      const isIdle =
        this.knightHorizontalMovement.getHorizontalMovement() ==
        HorizontalMovementEnum.NONE;
      return isIdle ? this.knight.states.idle : this.knight.states.run;
    }

    this.knight.verticalPosition = this.getUpdatedVerticalPosition();
    this.knight.horizontalPosition +=
      this.knightHorizontalMovement.getHorizontalPosDifference();

    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
    this.fallingSpeed = this.knight.gravity;
    this.knightHorizontalMovement.reset();
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
      this.fallingSpeed + this.knight.gravity,
      this.knight.maxFallingSpeed
    );

    return distanceToFall;
  }
}
