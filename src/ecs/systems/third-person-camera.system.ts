import { query } from "bitecs";
import type { EngineContext } from "../../engine/context";
import type { FrameTime } from "../../engine/time-controller";
import { getPosition, Transform } from "../components";
import { Player } from "../player/player.component";

export function cameraFollowSystem(
  { world, three }: EngineContext,
  time: FrameTime
) {
  const firstPlayerId = query(world, [Transform, Player]).at(0);

  if (!firstPlayerId) return;

  const { x, y, z } = getPosition(firstPlayerId);
  const playerHeight = 1.5;
  three.controls.moveTo(x, y + playerHeight, z);
}
