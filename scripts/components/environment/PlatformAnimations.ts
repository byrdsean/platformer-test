class PlatformAnimations {
    private static readonly ASSET_FOLDER = "./dist/images/environment";

    private constructor() {}

    static getPlatformAnimation(): AnimationFrame {
        return this.buildAnimationFrame("platform.png", 1, 120, 56);
    }

    private static buildAnimationFrame(
        file: string,
        numberOfFrames: number,
        frameWidth: number,
        frameHeight: number,
    ): AnimationFrame {
        const image = new Image();
        image.src = `${this.ASSET_FOLDER}/${file}`;

        return {
            imageSource: image,
            numberOfFrames: numberOfFrames,
            frameHeight: frameHeight,
            frameWidth: frameWidth,
        };
    }
}