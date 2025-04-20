class Knight extends AbstractMoveableEntity implements ControllableInterface {
  public readonly states: KnightStatesModel;
  private currentState: AbstractKnightState;

  constructor() {
    super(HorizontalMovementEnum.RIGHT);

    this.states = {
      idle: new IdleState(this),
      run: new RunState(this),
      attack: new AttackState(this),
      fall: new FallState(this),
    };
    this.currentState = this.states.fall;
  }

  setInput(userInputs: UserInputModel) {
    const newState = this.currentState.input(userInputs);
    this.updateCurrentState(newState);
  }

  draw() {
    const newState = this.currentState.update();
    this.updateCurrentState(newState);
  }

  private updateCurrentState(newState: AbstractKnightState | null) {
    if (!newState) return;
    this.currentState.exit();
    this.currentState = newState;
  }
}
