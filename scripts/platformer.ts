class Platformer {
  private lastTimestamp = 0;
  private canvasInstance: Canvas;
  private knight: Knight;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();
    this.knight = new Knight();
  }

  private squareHeight = 0;
  renderFrame() {
    const ctx = this.canvasInstance.canvasContext;

    ctx.clearRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);

    ctx.save();
    this.knight.drawAttack();
    ctx.restore();
  }

  shouldRender(timestamp: number): boolean {
    const framesPerSecond = FramesPerSecondInstance.getFramesPerSecond();
    const millisecondsSinceLastRequest = Math.floor(
      timestamp - this.lastTimestamp
    );
    this.lastTimestamp = timestamp;

    return (
      framesPerSecond.minimumMillisecondsToRender <=
        millisecondsSinceLastRequest &&
      millisecondsSinceLastRequest <=
        framesPerSecond.maximumMillisecondsToRender
    );
  }

  resizeCanvas() {
    this.canvasInstance = CanvasInstance.getNewInstance();
  }
}

const platformer = new Platformer();

function animate(timestamp: number) {
  if (platformer.shouldRender(timestamp)) {
    platformer.renderFrame();
  }
  requestAnimationFrame(animate);
}
animate(0);

window.addEventListener("resize", () => {
  platformer.resizeCanvas();
});
