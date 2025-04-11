class Knight {
  private readonly WAIT_FOR_NEXT_RENDER_MILLISECONDS = 100;
  private lastAnimationTimestamp = 0;
  private currentFrame = 0;
  private canvasInstance: Canvas;
  private knightAnimationFrames: KnightAnimationFrames;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();

    const knightAnimations = new KnightAnimations();
    this.knightAnimationFrames = knightAnimations.getAnimations();
  }

  drawAttack() {
    const attackAnimation = this.knightAnimationFrames["attack"];
    this.draw(attackAnimation);
  }

  drawIdle() {
    const idleAnimation = this.knightAnimationFrames["idle"];
    this.draw(idleAnimation);
  }

  private draw(animationFrame: AnimationFrame) {
    const currentTimestamp = Date.now();
    const shouldDrawNextFrame = this.WAIT_FOR_NEXT_RENDER_MILLISECONDS <= currentTimestamp - this.lastAnimationTimestamp;

    if(shouldDrawNextFrame) {
      this.currentFrame++;
      this.lastAnimationTimestamp = currentTimestamp;
    }

    const frameToDraw = this.currentFrame % animationFrame.numberOfFrames;
    const ctx = this.canvasInstance.canvasContext;

    ctx.drawImage(
      animationFrame.imageSource,
      frameToDraw * animationFrame.frameWidth,
      0,
      animationFrame.frameWidth,
      animationFrame.frameHeight,
      0,
      0,
      animationFrame.frameWidth,
      animationFrame.frameHeight
    );
  }
}
