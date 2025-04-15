class KnightAnimations {
  private readonly ASSET_FOLDER = "./dist/images/knight";
  private readonly SPRITE_WIDTH_PIXELS = 120;
  private readonly SPRITE_HEIGHT_PIXELS = 80;

  public constructor() {}

  getAnimations(): KnightAnimationFrames {
    const attackAnimation = this.buildAnimationFrame("attack.png", 4);
    const idleAnimation = this.buildAnimationFrame("idle.png", 10);
    const runAnimation = this.buildAnimationFrame("run.png", 10);
    return {
      attack: attackAnimation,
      idle: idleAnimation,
      run: runAnimation,
    };
  }

  private buildAnimationFrame(
    file: string,
    numberOfFrames: number
  ): AnimationFrame {
    const image = new Image();
    image.src = `${this.ASSET_FOLDER}/${file}`;

    return {
      imageSource: image,
      numberOfFrames: numberOfFrames,
      frameHeight: this.SPRITE_HEIGHT_PIXELS,
      frameWidth: this.SPRITE_WIDTH_PIXELS,
    };
  }
}
