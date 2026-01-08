import { Debugger } from "../debugger/debugger";
import type { EngineContext } from "./context";
import type { FrameTime } from "./time-controller";

export type SystemFn = (context: EngineContext, time: FrameTime) => void;

export function startLoop(context: EngineContext, systemList: SystemFn[]) {
  context.time.update();
  const debuggerService = Debugger.getInstance();
  debuggerService.initialize(context);

  function loop() {
    debuggerService.startFpsRecord();

    const time = context.time.update();
    systemList.forEach((system) => system(context, time));

    debuggerService.stopFpsRecord();
    debuggerService.update(context);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
