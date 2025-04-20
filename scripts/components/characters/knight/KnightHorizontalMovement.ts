class KnightHorizontalMovement {
  private readonly knight: Knight;
  private horizontalMovement: HorizontalMovementEnum;

  constructor(knight: Knight) {
    this.knight = knight;
    this.horizontalMovement = HorizontalMovementEnum.NONE;
  }

  setMovementLeft() {
    this.horizontalMovement = HorizontalMovementEnum.LEFT;
    this.knight.horizontalFacingDirection = HorizontalMovementEnum.LEFT;
  }

  setMovementRight() {
    this.horizontalMovement = HorizontalMovementEnum.RIGHT;
    this.knight.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;
  }

  reset() {
    this.horizontalMovement = HorizontalMovementEnum.NONE;
  }

  getHorizontalMovement() {
    return this.horizontalMovement;
  }

  getHorizontalPosDifference(): number {
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
