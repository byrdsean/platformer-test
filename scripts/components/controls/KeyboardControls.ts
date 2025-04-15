class KeyboardControls {
  private togglePause: () => void;

  public constructor(togglePause: () => void) {
    this.togglePause = togglePause;
  }

  addKeyPressedDown() {
    window.addEventListener("keydown", (e) => {
      const currentComponent = InteractiveComponentInstance.getCurrentInteractiveComponent();
      switch (e.code) {
        case "ArrowLeft":
          currentComponent?.keydownHorizontal(HorizontalMovementEnum.LEFT);
          break;
        case "ArrowRight":
          currentComponent?.keydownHorizontal(HorizontalMovementEnum.RIGHT);
          break;
        case "ArrowUp":
          currentComponent?.keydownVertical(VerticalMovementEnum.UP);
          break;
        case "ArrowDown":
          currentComponent?.keydownVertical(VerticalMovementEnum.DOWN);
          break;
        case "KeyP":
          this.togglePause();
          break;
      }
    });
  }

  addKeyPressedUp() {
    window.addEventListener("keyup", (e) => {
      const currentComponent = InteractiveComponentInstance.getCurrentInteractiveComponent();
      switch (e.code) {
        case "ArrowLeft":
        case "ArrowRight":
          currentComponent?.keyupHorizontal();
          break;
        case "ArrowUp":
        case "ArrowDown":
          currentComponent?.keyupVertical();
          break;
      }
    });
  }
}
