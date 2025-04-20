class RunState extends AbstractKnightState {
  private horizontalMovement: HorizontalMovementEnum;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getRunAnimation());
    this.horizontalMovement = HorizontalMovementEnum.NONE;
  }

  override input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      return null;
    }

    const areMovementInputsFalse =
      !userInputs.left &&
      !userInputs.right &&
      !userInputs.up &&
      !userInputs.down;
    if (areMovementInputsFalse) {
      return this.knight.states.idle;
    }

    if (userInputs.left) {
      this.horizontalMovement = HorizontalMovementEnum.LEFT;
      this.knight.horizontalFacingDirection = HorizontalMovementEnum.LEFT;
    } else if (userInputs.right) {
      this.horizontalMovement = HorizontalMovementEnum.RIGHT;
      this.knight.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
    }

    if (userInputs.attack) {
      return this.knight.states.attack;
    }

    return null;
  }

  override update(): AbstractKnightState | null {
    if (!this.pauseControls.isPaused()) {
      this.knight.horizontalPosition += this.getHorizontalPosDifference();
    }
    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
    this.horizontalMovement = HorizontalMovementEnum.NONE;
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
