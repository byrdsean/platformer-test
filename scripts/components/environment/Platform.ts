class Platform extends AbstractMoveableEntity implements CollisionInterface {
    private readonly canvasInstance: Canvas;
    private readonly animation: AnimationFrame;

    constructor(horizontalPosition: number, verticalPosition: number) {
        super(HorizontalMovementEnum.NONE);
        this.canvasInstance = CanvasInstance.getInstance();
        this.animation = PlatformAnimations.getPlatformAnimation();

        this.horizontalPosition = horizontalPosition;
        this.verticalPosition = verticalPosition;
    }

    draw() {
        const ctx = this.canvasInstance.canvasContext;
        ctx.save();

        ctx.drawImage(
            this.animation.imageSource,
            0,
            0,
            this.animation.frameWidth,
            this.animation.frameHeight,
            this.horizontalPosition,
            this.verticalPosition,
            this.animation.frameWidth,
            this.animation.frameHeight
        );

        ctx.restore();
    }

    getCollisionDimensions(): CollisionModel {
        return {
            minX: this.horizontalPosition,
            minY: this.verticalPosition,
            maxX: this.horizontalPosition + this.animation.frameWidth,
            maxY: this.verticalPosition + this.animation.frameHeight
        }
    }
}