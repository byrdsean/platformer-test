class RunState extends AbstractKnightState {
  private readonly knightHorizontalMovement: KnightHorizontalMovement;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getRunAnimation());
    this.knightHorizontalMovement = new KnightHorizontalMovement(knight);
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
      this.knightHorizontalMovement.setMovementLeft();
    } else if (userInputs.right) {
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

  override update(): AbstractKnightState | null {
    if (!this.pauseControls.isPaused()) {
      this.knight.horizontalPosition +=
        this.knightHorizontalMovement.getHorizontalPosDifference();
    }
    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
    this.knightHorizontalMovement.reset();
  }
}
