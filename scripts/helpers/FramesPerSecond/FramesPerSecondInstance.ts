class FramesPerSecondInstance {
  private static readonly FPS = 60;
  private static framesPerSecond: FramesPerSecond | null;

  private constructor() {}

  static getFramesPerSecond(): FramesPerSecond {
    if (this.framesPerSecond) return this.framesPerSecond;

    const millisecondsPerFrame = 1000 / FramesPerSecondInstance.FPS;
    const minimumMillisecondsToRender = Math.floor(millisecondsPerFrame) - 1;

    const newFramesPerSecond = {
      fps: this.FPS,
      millisecondsPerFrame,
      minimumMillisecondsToRender,
    };
    this.framesPerSecond = newFramesPerSecond;

    return newFramesPerSecond;
  }
}
