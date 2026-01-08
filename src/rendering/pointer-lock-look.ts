import type { ThreeContext } from "./three-context";

export class PointerLockLook {
  #locked = false;
  sensitivity = 0.002;

  constructor(private three: ThreeContext) {}

  enable() {
    const element = this.three.renderer.domElement;

    const onLockChange = () => {
      this.#locked = document.pointerLockElement === element;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.#locked) return;

      const azimuth = -e.movementX * this.sensitivity;
      const polar = -e.movementY * this.sensitivity;

      //   rotate(azimuth, polar, enableTransition?)
      this.three.controls.rotate(azimuth, polar, false);
    };

    element.addEventListener("click", () => {
      if (document.pointerLockElement !== element) element.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("mousemove", onMouseMove);
  }
}
