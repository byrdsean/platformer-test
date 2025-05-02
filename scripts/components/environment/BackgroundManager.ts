class BackgroundManager {
    private static HORIZONTAL_DISTANCE_TO_MOVE = 5;
    private readonly backgroundLayers: BackgroundLayer[]

    constructor() {
        this.backgroundLayers = [];
    }

    addBackgroundLayer(imageSource: string, width: number, height: number, speed: number) {
        const fullSource = `./dist/images/environment/${imageSource}`;
        const canvas = CanvasInstance.getInstance();

        const backgroundLayer = new BackgroundLayer(fullSource, width, height, 0, canvas.height - height, speed);
        this.backgroundLayers.push(backgroundLayer);
    }

    draw() {
        const { canvasContext: ctx, height, width } = CanvasInstance.getInstance();

        this.backgroundLayers.forEach(backgroundLayer => {
            const repetitions = Math.ceil(width / backgroundLayer.width) + 1;
            Array.from({length : repetitions})
                .forEach((_, index) => {
                    ctx.drawImage(
                        backgroundLayer.image,
                        backgroundLayer.getHorizontalPosition() + (backgroundLayer.width * index),
                        backgroundLayer.getVerticalPosition()
                    );
                });

                backgroundLayer.updateHorizontalPosition(BackgroundManager.HORIZONTAL_DISTANCE_TO_MOVE);
        });
    }
}