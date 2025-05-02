class Platformer {
  private lastTimestamp = 0;
  private canvasInstance: Canvas;
  private readonly pauseControls: PauseControls;
  private readonly knight: Knight;
  private readonly keyboardControls: KeyboardControls;
  private readonly platforms: Platform[];
  private readonly backgroundManager: BackgroundManager;

  constructor() {
    this.canvasInstance = CanvasInstance.getInstance();
    this.knight = new Knight();
    InteractiveComponentInstance.setCurrentInteractiveComponent(this.knight);

    this.pauseControls = new PauseControls();
    this.pauseControls.clearPauseFlag();

    this.keyboardControls = new KeyboardControls(() => {
      this.pauseControls.togglePaused();
    });
    this.keyboardControls.addKeyPressedDown();
    this.keyboardControls.addKeyPressedUp();

    this.platforms = [
      new Platform(0, 200),
      new Platform(220, 200),
      new Platform(440, 200),
    ];
    this.platforms.forEach((platform) =>
      CollisionInstance.addCollidableObject(platform)
    );

    this.backgroundManager = new BackgroundManager();
    this.backgroundManager.addBackgroundLayer("layer-2.png", 2400, 720, 0.25);
    this.backgroundManager.addBackgroundLayer("layer-3.png", 2400, 720, 0.5);
    this.backgroundManager.addBackgroundLayer("layer-4.png", 2400, 720, 0.75);
    this.backgroundManager.addBackgroundLayer("layer-5.png", 2400, 720, 1);
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

    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, this.canvasInstance.width, this.canvasInstance.height);

    this.backgroundManager.draw();

    this.platforms.forEach((platform) => {
      platform.draw();
    });

    const interactiveComponent =
      InteractiveComponentInstance.getCurrentInteractiveComponent();
    const keyboardButtons = this.keyboardControls.getKeyboardInputs();
    interactiveComponent?.setInput(keyboardButtons);
    interactiveComponent?.draw();
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
