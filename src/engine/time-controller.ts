import * as THREE from "three";

export interface FrameTime {
  delta: number;
  elapsed: number;
  paused: boolean;
}

export class TimeController {
  static #instance: TimeController;

  private clock = new THREE.Clock();
  private paused = false;
  private elapsed = 0;

  static getInstance(): TimeController {
    return (TimeController.#instance =
      TimeController.#instance ?? new TimeController());
  }

  get isRunning(): boolean {
    return !this.paused;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.clock.getDelta();
  }

  toggle() {
    this.paused ? this.resume() : this.pause();
  }

  update(): FrameTime {
    if (this.paused) {
      this.clock.getDelta();
      return { delta: 0, elapsed: this.elapsed, paused: true };
    }

    const FPS = 60;
    const delta = this.clock.getDelta();
    const clampedDelta = Math.min(delta, 1 / FPS);
    this.elapsed += clampedDelta;
    return { delta: clampedDelta, elapsed: this.elapsed, paused: false };
  }
}
