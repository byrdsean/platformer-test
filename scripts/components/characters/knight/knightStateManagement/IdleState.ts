class IdleState extends AbstractKnightState {
  constructor(knight: Knight) {
    super(knight, KnightAnimations.getIdleAnimation());
  }

  override input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.pauseControls.isPaused()) {
      return null;
    }

    if (userInputs.left || userInputs.right) {
      return this.knight.states.run;
    }

    if (userInputs.up) {
      return this.knight.states.jump;
    }

    if (userInputs.attack) {
      return this.knight.states.attack;
    }

    return null;
  }

  override update(): AbstractKnightState | null {
    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
  }
}
