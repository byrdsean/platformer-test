abstract class AbstractMoveableEntity {
  public gravity = 5;
  public horizontalPosition = 0;
  public verticalPosition = 0;
  public horizontalFacingDirection: HorizontalMovementEnum;

  constructor(horizontalFacingDirection: HorizontalMovementEnum) {
    this.horizontalFacingDirection = horizontalFacingDirection;
  }
}
