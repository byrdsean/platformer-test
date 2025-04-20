class AttackState extends AbstractKnightState {
  private static readonly WAIT_FOR_NEXT_RENDER_MILLISECONDS = 50;
  private startedAttack = false;

  constructor(knight: Knight) {
    super(knight, KnightAnimations.getAttackAnimation());
    this.waitForNextRenderMilliseconds =
      AttackState.WAIT_FOR_NEXT_RENDER_MILLISECONDS;
  }

  override input(userInputs: UserInputModel): AbstractKnightState | null {
    if (this.startedAttack && this.currentFrame == 0) {
      return this.knight.states.idle;
    }

    return null;
  }

  override update(): AbstractKnightState | null {
    this.startedAttack = true;
    this.draw();
    return null;
  }

  override exit(): void {
    this.currentFrame = 0;
    this.startedAttack = false;
  }
}
