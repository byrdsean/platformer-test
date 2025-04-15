class PauseControls {
    private readonly IS_PAUSED = "isPaused";

    isPaused(): boolean {
        const isPaused = localStorage.getItem(this.IS_PAUSED) || 'false';
        return isPaused === 'true';
    }

    togglePaused(): boolean {
        const setPauseFlag = this.isPaused() ? "false" : "true";
        localStorage.setItem(this.IS_PAUSED, setPauseFlag);
        return this.isPaused();
    }

    setPause(isPaused: boolean): boolean {
        localStorage.setItem(this.IS_PAUSED, isPaused ? "true" : "false");
        return this.isPaused();
    }

    clearPauseFlag() {
        localStorage.removeItem(this.IS_PAUSED);
    }
}