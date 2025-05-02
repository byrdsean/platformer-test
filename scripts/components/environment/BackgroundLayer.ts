class BackgroundLayer {
    private horizontalPosition: number;
    private verticalPosition: number;
    private speed: number;

    public height: number;
    public width: number;
    public readonly image: HTMLImageElement;

    constructor(imageSource: string, width: number, height: number, horizontalPosition: number, verticalPosition: number, speed: number) {
        this.height = height;
        this.width = width;
        this.horizontalPosition = horizontalPosition;
        this.verticalPosition = verticalPosition;
        this.speed = speed;

        this.image = new Image();
        this.image.src = imageSource;
    }

    getHorizontalPosition() {
        return this.horizontalPosition;
    }

    getVerticalPosition() {
        return this.verticalPosition;
    }

    updateHorizontalPosition(delta: number) {
        this.horizontalPosition =
            this.horizontalPosition <= this.width * -1
            ? //Find the -x offset from 0 (number of pixels we need to place the image to the left of origin)
                this.horizontalPosition + this.width
            : //Move the x position to the left (adjust gamespeed for speed modifier)
                this.horizontalPosition - (delta * this.speed);
    }
}