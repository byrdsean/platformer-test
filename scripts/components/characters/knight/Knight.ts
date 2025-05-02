class Knight extends AbstractMoveableEntity implements ControllableInterface, CollisionInterface {
  public readonly states: KnightStatesModel;
  private currentState: AbstractKnightState;
  public height = 0;
  public width = 0;

  constructor() {
    super(HorizontalMovementEnum.RIGHT);

    this.states = {
      idle: new IdleState(this),
      run: new RunState(this),
      attack: new AttackState(this),
      fall: new FallState(this),
      jump: new JumpState(this),
    };

    this.currentState = this.states.idle;
    this.currentState.enter();
  }

  setInput(userInputs: UserInputModel) {
    const newState = this.currentState.input(userInputs);
    this.updateCurrentState(newState);
  }

  draw() {
    const newState = this.currentState.update();
    this.updateCurrentState(newState);
  }

  getCollisionDimensions(): CollisionModel {
    return {
        minX: this.horizontalPosition,
        minY: this.verticalPosition,
        maxX: this.horizontalPosition + this.width,
        maxY: this.verticalPosition + this.height
    }
  }

  private updateCurrentState(newState: AbstractKnightState | null) {
    if (!newState) return;
    this.currentState.exit();

    this.currentState = newState;
    this.currentState.enter();
  }
}
