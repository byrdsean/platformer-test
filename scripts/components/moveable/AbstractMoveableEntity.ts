abstract class AbstractMoveableEntity {
  public jumpSpeed = 5;
  public maxFallingSpeed = 5;
  public gravity = 0.125;

  public horizontalPosition = 0;
  public verticalPosition = 0;
  public horizontalFacingDirection: HorizontalMovementEnum;
  public horizontalMovementSpeed = 2;

  constructor(horizontalFacingDirection: HorizontalMovementEnum) {
    this.horizontalFacingDirection = horizontalFacingDirection;
  }
}
