class InteractiveComponentInstance {
  private static currentInteractiveComponent: ControllableInterface | null;
  private static previousInteractiveComponent: ControllableInterface | null;

  private constructor() {}

  static getCurrentInteractiveComponent(): ControllableInterface | null {
    return this.currentInteractiveComponent;
  }

  static setCurrentInteractiveComponent(
    currentInteractiveComponent: ControllableInterface
  ) {
    this.previousInteractiveComponent = this.currentInteractiveComponent;
    this.currentInteractiveComponent = currentInteractiveComponent;
  }
}
