import { playerInputSystem } from "./inputs/input.system";
import { playerFacingSystem } from "./systems/facing.system";
import { playerGravitySystem } from "./systems/gravity.system";
import { playerMovementSystem } from "./systems/movement.system";

export const playerSystemList = [
  playerInputSystem,
  playerGravitySystem,
  playerMovementSystem,
  playerFacingSystem,
];
