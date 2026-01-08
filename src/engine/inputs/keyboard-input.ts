export class KeyboardInput {
  private down = new Set<string>();
  private pressed = new Set<string>();

  constructor(target: Window | HTMLElement = window) {
    target.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
    });
    target.addEventListener("keyup", (e: KeyboardEvent) => {
      this.down.delete(e.code);
      this.pressed.delete(e.code);
    });
  }

  isDown(code: string) {
    return this.down.has(code);
  }

  justPressed(code: string) {
    return this.pressed.has(code);
  }

  endFrame() {
    this.pressed.clear();
  }
}
