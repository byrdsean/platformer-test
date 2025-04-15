class Platformer {
  private lastTimestamp = 0;
  private canvasInstance: Canvas;
  private pauseControls: PauseControls;
  private knight: Knight;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();
    this.knight = new Knight();

    this.pauseControls = new PauseControls();
    this.pauseControls.clearPauseFlag();

    const keyboardControls = new KeyboardControls(() => {
      this.pauseControls.togglePaused();
    });
    keyboardControls.addKeyPressedDown();
  }

  enablePaused() {
    this.pauseControls.setPause(true);
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

    if (this.lastTimestamp === 0) {
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
