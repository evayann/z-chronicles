import { GUIDebug } from "./gui/gui.debug";
import { EngineContext } from "../engine/context";
import { PhysicsGuidDebug } from "./gui/physics.gui-debug";

export class Debugger {
  static #instance: Debugger;

  #guiDebug = new GUIDebug();

  static getInstance(): Debugger {
    return (Debugger.#instance = Debugger.#instance ?? new Debugger());
  }

  initialize(context: EngineContext): void {
    this.#guiDebug.initialize(context);
  }

  update(context: EngineContext): void {
    this.#guiDebug.update(context);
  }

  startFpsRecord(): void {
    this.#guiDebug.startFpsRecord();
  }
  stopFpsRecord(): void {
    this.#guiDebug.stopFpsRecord();
  }
}
