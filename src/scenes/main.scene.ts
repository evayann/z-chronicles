import type { EngineContext } from "../engine/context";
import { createPlayerPrefab } from "../ecs/player/player.prefab";
import { createWorld } from "../prefabs/world.prefab";
import { createNpcPrefab } from "../ecs/npc/npc.prefab";

export function createMainScene(context: EngineContext) {
  createWorld(context);
  createPlayerPrefab(context);
  createNpcPrefab(context);
  createNpcPrefab(context);
  createNpcPrefab(context);
  createNpcPrefab(context);
}
