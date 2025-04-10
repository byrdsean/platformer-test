class KnightAnimation {
  private static ASSET_FOLDER = "./dist/assets";
  private static SPRITE_WIDTH_PIXELS = 120;
  private static SPRITE_HEIGHT_PIXELS = 80;

  private constructor() {}

  public static animations = {
    attack: {
      imageSource: `${KnightAnimation.ASSET_FOLDER}/_Attack.png`,
      numberOfFrames: 4,
      frameHeight: KnightAnimation.SPRITE_HEIGHT_PIXELS,
      frameWidth: KnightAnimation.SPRITE_WIDTH_PIXELS,
    } as AnimationFrame,
    idle: {
      imageSource: `${KnightAnimation.ASSET_FOLDER}/_Idle.png`,
      numberOfFrames: 10,
      frameHeight: KnightAnimation.SPRITE_HEIGHT_PIXELS,
      frameWidth: KnightAnimation.SPRITE_WIDTH_PIXELS,
    } as AnimationFrame,
  };
}
