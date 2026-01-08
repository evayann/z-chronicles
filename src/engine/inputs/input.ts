import { KeyboardInput } from "./keyboard-input";

export class Input {
  #keyboardInput = new KeyboardInput(window);

  get state() {
    const topVector = this.#keyboardInput.isDown("KeyW") ? 1 : 0;
    const leftVector = this.#keyboardInput.isDown("KeyA") ? 1 : 0;
    const rightVector = this.#keyboardInput.isDown("KeyD") ? 1 : 0;
    const bottomVector = this.#keyboardInput.isDown("KeyS") ? 1 : 0;

    return {
      axisX: rightVector - leftVector,
      axisY: bottomVector - topVector,
      isJumpPressed: this.#keyboardInput.justPressed("Space"),
      isSprinting: this.#keyboardInput.justPressed("ShiftLeft"),
    };
  }
}
