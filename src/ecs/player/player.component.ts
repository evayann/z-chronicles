import { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import { MAX_ENTITIES } from "../entities";

export const PlayerCamera = {};

export const Player = {
  controller: [] as KinematicCharacterController[],
  isSprinting: [] as boolean[],
  sprintMult: new Float32Array(MAX_ENTITIES),
  jumpPressed: new Uint8Array(MAX_ENTITIES),
};

export const initializePlayer = (id: number) => {
  Player.isSprinting[id] = false;
  Player.sprintMult[id] = 2;
  Player.jumpPressed[id] = 0;
};

// Todo remove
export const isPlayerJump = (id: number) => Player.jumpPressed[id] === 1;

export const PlayerController = {};
