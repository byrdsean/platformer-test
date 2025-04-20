abstract class AbstractMoveableEntity {
  public fallingAcceleration = 0.05;
  public terminalVelocity = 10;
  public gravity = 5;

  public horizontalPosition = 0;
  public verticalPosition = 0;
  public horizontalFacingDirection: HorizontalMovementEnum;
  public horizontalMovementSpeed = 2;

  constructor(horizontalFacingDirection: HorizontalMovementEnum) {
    this.horizontalFacingDirection = horizontalFacingDirection;
  }
}
