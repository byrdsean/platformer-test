class KnightAnimations {
  private static readonly ASSET_FOLDER = "./dist/images/knight";
  private static readonly SPRITE_WIDTH_PIXELS = 120;
  private static readonly SPRITE_HEIGHT_PIXELS = 80;

  private constructor() {}

  static getAttackAnimation(): AnimationFrame {
    return this.buildAnimationFrame("attack.png", 4);
  }

  static getIdleAnimation(): AnimationFrame {
    return this.buildAnimationFrame("idle.png", 10);
  }

  static getRunAnimation(): AnimationFrame {
    return this.buildAnimationFrame("run.png", 10);
  }

  private static buildAnimationFrame(
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
