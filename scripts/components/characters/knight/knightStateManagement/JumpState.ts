class JumpState extends AbstractKnightState {
  private readonly knightHorizontalMovement: KnightHorizontalMovement;
  private jumpSpeed: number;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getJumpAnimation());
    this.knightHorizontalMovement = new KnightHorizontalMovement(knight);
    this.jumpSpeed = this.knight.jumpSpeed;
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

  override exit(): void {
    this.currentFrame = 0;
    this.jumpSpeed = this.knight.jumpSpeed;
    this.knightHorizontalMovement.reset();
  }
}
