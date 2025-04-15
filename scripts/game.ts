const platformer = new Platformer();

window.addEventListener("resize", () => {
  platformer.enablePaused();
  platformer.resizeCanvas();
});

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    platformer.enablePaused();
  }
});

function animate(timestamp: number) {
  platformer.renderFrame(timestamp);
  requestAnimationFrame(animate);
}
animate(0);
