class IdleState extends AbstractKnightState{
    private static readonly ANIMATION_NAME = "idle";

    constructor(knight: Knight) {
        super(knight, KnightAnimations.getIdleAnimation());
    }

    input(userInputs: UserInputModel): AbstractKnightState | null {
        if (this.pauseControls.isPaused()) {
            return null;
        }

        if (userInputs.left || userInputs.right) {
            this.exit();
            return this.knight.states.run;
        }

        if (userInputs.attack) {
            this.exit();
            return this.knight.states.attack;
        }

        return null;
    }

    update(): AbstractKnightState | null {
        this.draw();
        return null;
    }

    exit(): void {
        this.currentFrame = 0;
    }
}