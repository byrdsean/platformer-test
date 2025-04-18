class Knight implements ControllableInterface {
    public horizontalPosition = 0;
    public horizontalFacingDirection: HorizontalMovementEnum;
    public readonly states: KnightStatesModel

    private currentState: AbstractKnightState

    constructor() {
        this.horizontalFacingDirection = HorizontalMovementEnum.RIGHT;

        this.states = {
            idle: new IdleState(this),
            run: new RunState(this),
            attack: new AttackState(this),
        }
        this.currentState = this.states.idle;
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
        this.currentState = newState;
    }
}