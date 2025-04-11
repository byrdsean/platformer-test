class KeyboardControls {
  private togglePause: () => void;

  public constructor(togglePause: () => void) {
    this.togglePause = togglePause;
  }

  addKeyPressedDown() {
    window.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft":
          console.log("left");
          break;
        case "ArrowRight":
          console.log("right");
          break;
        case "ArrowUp":
          console.log("up");
          break;
        case "ArrowDown":
          console.log("down");
          break;
        case "KeyP":
          this.togglePause();
          break;
      }
    });
  }
}
