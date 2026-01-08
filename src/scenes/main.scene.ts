import type { EngineContext } from "../engine/context";
import { createPlayerPrefab } from "../ecs/player/player.prefab";
import { createWorld } from "../prefabs/world.prefab";

export function createMainScene(context: EngineContext) {
  createWorld(context);
  createPlayerPrefab(context);
}
