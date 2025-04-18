class FallState extends AbstractKnightState {
  private gameHeight: number;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getFallAnimation());

    const canvasInstance = CanvasInstance.getInstance();
    this.gameHeight = canvasInstance.height;
  }

  input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      return null;
    }

    const lowerImageBound =
      this.getUpdatedVerticalPosition() + this.animation.frameHeight;

    if (lowerImageBound >= this.gameHeight) {
      this.exit();
      return this.knight.states.idle;
    }

    return null;
  }

  update(): AbstractKnightState | null {
    this.knight.verticalPosition = this.getUpdatedVerticalPosition();
    this.draw();
    return null;
  }

  exit(): void {
    this.currentFrame = 0;
  }

  private getUpdatedVerticalPosition(): number {
    const frameLowerVerticalPos =
      this.knight.verticalPosition + this.animation.frameHeight;
    const distanceFromGameHeight = this.gameHeight - frameLowerVerticalPos;

    if (distanceFromGameHeight >= this.knight.gravity) {
      return this.knight.verticalPosition + this.knight.gravity;
    } else {
      return this.knight.verticalPosition + distanceFromGameHeight;
    }
  }
}
