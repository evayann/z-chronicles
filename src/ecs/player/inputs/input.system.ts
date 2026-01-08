import { query } from "bitecs";
import type { EngineContext } from "../../../engine/context";
import type { FrameTime } from "../../../engine/time-controller";
import {
  CharacterMovement,
  resetCharacterMovement,
} from "../../components/character";
import { Player } from "../player.component";

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export function playerInputSystem(
  { world, input }: EngineContext,
  time: FrameTime
) {
  const playerManageByMovementList = query(world, [Player, CharacterMovement]);
  if (time.paused) {
    for (const e of playerManageByMovementList) resetCharacterMovement(e);
    return;
  }

  const state = input.state;

  for (const e of playerManageByMovementList) {
    // axes bruts (ex: clavier = -1/0/1, stick = -1..1)
    const rawX = clamp(state.axisX, -1, 1);
    const rawY = clamp(state.axisY, -1, 1);

    // normalisation (diagonales pas plus rapides)
    const len = Math.hypot(rawX, rawY);
    const nx = len > 1e-6 ? rawX / Math.min(len, 1) : 0;
    const ny = len > 1e-6 ? rawY / Math.min(len, 1) : 0;

    // on écrit dans le component pour toutes les entités contrôlées
    CharacterMovement.x[e] = nx; // droite +
    CharacterMovement.y[e] = 0; // vertical géré ailleurs
    CharacterMovement.z[e] = ny; // avant +

    Player.jumpPressed[e] = +state.isJumpPressed;
    Player.isSprinting[e] = state.isSprinting;
  }
}
