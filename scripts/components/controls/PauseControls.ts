class PauseControls {
    private readonly IS_PAUSED = "isPaused";
    private readonly FALSE = "false";
    private readonly TRUE = "true";

    isPaused(): boolean {
        const isPaused = localStorage.getItem(this.IS_PAUSED) || this.FALSE;
        return isPaused === this.TRUE;
    }

    togglePaused(): boolean {
        const setPauseFlag = this.isPaused() ? this.FALSE : this.TRUE;
        localStorage.setItem(this.IS_PAUSED, setPauseFlag);
        return this.isPaused();
    }

    setPause(isPaused: boolean): boolean {
        localStorage.setItem(this.IS_PAUSED, isPaused ? this.TRUE : this.FALSE);
        return this.isPaused();
    }

    clearPauseFlag() {
        localStorage.removeItem(this.IS_PAUSED);
    }
}