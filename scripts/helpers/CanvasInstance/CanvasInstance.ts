class CanvasInstance {
  private static GAME_SCREEN_ID = "game_screen";
  private static instance: Canvas | null;

  private constructor() {}

  static getInstance(): Canvas {
    return this.instance ? this.instance : this.getNewInstance();
  }

  static getNewInstance(): Canvas {
    const body = document.getElementById("body")! as HTMLElement;
    const bodyBoundingClientRect = body.getBoundingClientRect();

    const height = Math.ceil(bodyBoundingClientRect.height);
    const width = Math.ceil(bodyBoundingClientRect.width);

    const gameScreen: HTMLCanvasElement = document.getElementById(
      CanvasInstance.GAME_SCREEN_ID
    )! as HTMLCanvasElement;

    gameScreen.height = height;
    gameScreen.width = width;

    this.instance = {
      canvasContext: gameScreen.getContext("2d")!,
      height: height,
      width: width,
    } as Canvas;

    return this.instance;
  }
}
