class KeyboardControls {
  private togglePause: () => void;
  private userInputModel: UserInputModel;

  public constructor(togglePause: () => void) {
    this.togglePause = togglePause;
    this.userInputModel = {
      up: false,
      down: false,
      left: false,
      right: false,
      attack: false,
    };
  }

  getKeyboardInputs(): UserInputModel {
    return this.userInputModel;
  }

  addKeyPressedDown() {
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyP":
          this.togglePause();
          break;
        case "ArrowLeft":
          this.userInputModel = { ...this.userInputModel, left: true };
          break;
        case "ArrowRight":
          this.userInputModel = { ...this.userInputModel, right: true };
          break;
        case "ArrowUp":
          this.userInputModel = { ...this.userInputModel, up: true };
          break;
        case "ArrowDown":
          this.userInputModel = { ...this.userInputModel, down: true };
          break;
        case "Space":
          this.userInputModel = { ...this.userInputModel, attack: true };
          break;
      }
    });
  }

  addKeyPressedUp() {
    window.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          this.userInputModel = { ...this.userInputModel, left: false };
          break;
        case "ArrowRight":
          this.userInputModel = { ...this.userInputModel, right: false };
          break;
        case "ArrowUp":
          this.userInputModel = { ...this.userInputModel, up: false };
          break;
        case "ArrowDown":
          this.userInputModel = { ...this.userInputModel, down: false };
          break;
        case "Space":
          this.userInputModel = { ...this.userInputModel, attack: false };
          break;
      }
    });
  }
}
