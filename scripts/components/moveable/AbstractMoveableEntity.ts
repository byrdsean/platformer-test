abstract class AbstractMoveableEntity {
  protected horizontalMovement: HorizontalMovementEnum;
  protected verticalMovement: VerticalMovementEnum;

  protected constructor() {
    this.horizontalMovement = HorizontalMovementEnum.NONE;
    this.verticalMovement = VerticalMovementEnum.NONE;
  }

  public keydownVertical(movement: VerticalMovementEnum) {
    this.verticalMovement = movement;
  }

  public keydownHorizontal(movement: HorizontalMovementEnum) {
    this.horizontalMovement = movement;
  }

  public keyupVertical() {
    this.verticalMovement = VerticalMovementEnum.NONE;
  }

  public keyupHorizontal() {
    this.horizontalMovement = HorizontalMovementEnum.NONE;
  }
}
