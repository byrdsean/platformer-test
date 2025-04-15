class InteractiveComponentInstance {
  private static currentInteractiveComponent: AbstractMoveableEntity | null;
  private static previousInteractiveComponent: AbstractMoveableEntity | null;

  private constructor() {}

  static getCurrentInteractiveComponent(): AbstractMoveableEntity | null {
    return this.currentInteractiveComponent;
  }

  static setCurrentInteractiveComponent(
    currentInteractiveComponent: AbstractMoveableEntity
  ) {
    this.previousInteractiveComponent = this.currentInteractiveComponent;
    this.currentInteractiveComponent = currentInteractiveComponent;
  }
}
