class Knight {
  private currentFrame = 0;
  private canvasInstance: Canvas;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();
  }

  drawAttack() {
    const attackAnimation = KnightAnimation.animations["attack"];
    this.draw(attackAnimation);
  }

  drawIdle() {
    const idleAnimation = KnightAnimation.animations["idle"];
    this.draw(idleAnimation);
  }

  private draw(animationFrame: AnimationFrame) {
    const frameToDraw = this.currentFrame++ % animationFrame.numberOfFrames;

    const sprite = new Image();
    sprite.src = animationFrame.imageSource;

    const ctx = this.canvasInstance.canvasContext;

    ctx.drawImage(
      sprite,
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
