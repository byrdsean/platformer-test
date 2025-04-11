class Platformer {
  private lastTimestamp = 0;
  private isPaused = false;
  private canvasInstance: Canvas;
  private knight: Knight;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();
    this.knight = new Knight();

    const keyboardControls = new KeyboardControls(() => {
      this.togglePause();
    });
    keyboardControls.addKeyPressedDown();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  enablePaused() {
    console.log("enablePaused");
    this.isPaused = true;
  }

  disablePaused() {
    console.log("disablePaused");
    this.isPaused = false;
  }

  resizeCanvas() {
    this.canvasInstance = CanvasInstance.getNewInstance();
  }

  renderFrame(timestamp: number) {
    if (!this.shouldRenderFrame(timestamp)) return;

    const ctx = this.canvasInstance.canvasContext;

    ctx.clearRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);

    ctx.save();
    this.knight.drawAttack();
    // this.knight.drawIdle();
    ctx.restore();
  }

  private shouldRenderFrame(timestamp: number): boolean {
    if (timestamp === 0) return false;

    if (this.lastTimestamp === 0 || this.isPaused) {
      this.lastTimestamp = timestamp;
      return false;
    }

    const deltaTimeMilliseconds: number = Math.floor(
      timestamp - this.lastTimestamp
    );

    const framesPerSecond = FramesPerSecondInstance.getFramesPerSecond();
    const shouldRender =
      framesPerSecond.minimumMillisecondsToRender <= deltaTimeMilliseconds;

    if (shouldRender) {
      this.lastTimestamp = timestamp;
    }

    return shouldRender;
  }
}

const platformer = new Platformer();

function animate(timestamp: number) {
  platformer.renderFrame(timestamp);
  requestAnimationFrame(animate);
}
animate(0);

window.addEventListener("resize", () => {
  platformer.enablePaused();
  platformer.resizeCanvas();
});

document.addEventListener("visibilitychange", (e) => {
  switch (document.visibilityState) {
    case "hidden":
      platformer.enablePaused();
      break;
    case "visible":
      // platformer.disablePaused();
      break;
  }
});
