import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { Pane, TabApi } from "tweakpane";
import { EngineContext } from "../../engine/context";
import { TimeController } from "../../engine/time-controller";
import { PerformanceGuiDebug } from "./performance.gui-debug";
import { PlayerGuiDebug } from "./player.gui-debug";
import { PhysicsGuidDebug } from "./physics.gui-debug";

export class GUIDebug {
  #tabList!: TabApi;

  #gameDebugRender = true;

  #performanceDebugger;
  #physicsDebugger;
  #playerDebugger;

  constructor() {
    const globalPane = new Pane({ title: "Debug" });
    globalPane.registerPlugin(EssentialsPlugin);

    const startStopButton = globalPane.addButton({
      title: "Stop time",
    });
    startStopButton.on("click", () => {
      const gameLoopService = TimeController.getInstance();
      gameLoopService.toggle();
      startStopButton.title = `${
        gameLoopService.isRunning ? "Stop" : "Start"
      } time`;
    });

    const showHideDebugButton = globalPane.addButton({
      title: "Hide game debug",
    });
    showHideDebugButton.on("click", () => {
      // Todo
      const isDebugVisible = true;
      showHideDebugButton.title = `${
        isDebugVisible ? "Show" : "Hide"
      } game debug`;
    });

    this.#tabList = globalPane.addTab({
      pages: [{ title: "Perfs" }, { title: "Physic" }, { title: "Player" }],
    });

    this.#performanceDebugger = new PerformanceGuiDebug(this.#tabList.pages[0]);
    this.#physicsDebugger = new PhysicsGuidDebug(this.#tabList.pages[1]);
    this.#playerDebugger = new PlayerGuiDebug(this.#tabList.pages[2]);
  }

  initialize(context: EngineContext) {
    this.#physicsDebugger.initialize(context);
    this.#playerDebugger.addPlayer(context);
  }

  startFpsRecord(): void {
    this.#performanceDebugger.startFpsRecord();
  }

  stopFpsRecord(): void {
    this.#performanceDebugger.stopFpsRecord();
  }

  update({ physics, three: { renderer } }: EngineContext) {
    this.#performanceDebugger.updateRenderInformations(renderer);
    this.#physicsDebugger.update(physics);
    this.#playerDebugger.update();
    this.#tabList.refresh();
  }

  #initializeCameraPane(): void {
    // this.#cameraFolder = this.#globalPane.addFolder({
    //   title: "📹 Cameras 〢 Controls",
    //   expanded: false,
    // });
    // const cameraModeButton = this.#cameraFolder.addButton({
    //   title: "Change camera mode",
    // });
    // cameraModeButton.on("click", () => {
    //   console.log("test");
    // });
  }
}
