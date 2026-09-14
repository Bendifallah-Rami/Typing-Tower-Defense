// ═══════════════════════════════════════════════════════════
// GameLoop — Fixed-timestep game loop with interpolated render
// ═══════════════════════════════════════════════════════════

export type UpdateFn = (dt: number) => void;
export type RenderFn = (alpha: number) => void;

const FIXED_TIMESTEP = 1000 / 60; // ~16.67ms for 60 UPS
const MAX_FRAME_SKIP = 5; // prevent spiral of death

export class GameLoop {
  private updateFn: UpdateFn;
  private renderFn: RenderFn;
  private rafId: number | null = null;
  private accumulator = 0;
  private lastTime = 0;
  private running = false;
  private _fps = 0;
  private _frameCount = 0;
  private _fpsTime = 0;

  constructor(updateFn: UpdateFn, renderFn: RenderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  get fps(): number {
    return this._fps;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this._fpsTime = this.lastTime;
    this._frameCount = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  pause(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private tick = (currentTime: number): void => {
    if (!this.running) return;

    let frameTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clamp to prevent huge jumps (e.g., after tab switch)
    if (frameTime > FIXED_TIMESTEP * MAX_FRAME_SKIP) {
      frameTime = FIXED_TIMESTEP * MAX_FRAME_SKIP;
    }

    this.accumulator += frameTime;

    // Fixed-timestep updates
    let steps = 0;
    while (this.accumulator >= FIXED_TIMESTEP && steps < MAX_FRAME_SKIP) {
      this.updateFn(FIXED_TIMESTEP / 1000); // pass dt in seconds
      this.accumulator -= FIXED_TIMESTEP;
      steps++;
    }

    // Interpolation alpha for smooth rendering
    const alpha = this.accumulator / FIXED_TIMESTEP;
    this.renderFn(alpha);

    // FPS counter
    this._frameCount++;
    if (currentTime - this._fpsTime >= 1000) {
      this._fps = this._frameCount;
      this._frameCount = 0;
      this._fpsTime = currentTime;
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  destroy(): void {
    this.stop();
  }
}
