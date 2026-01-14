import { MAX_ENTITIES } from "../entities";

export const PlayerCamera = {};

export const Player = {
  maxVelocity: new Float32Array(MAX_ENTITIES),
  dragDamping: new Float32Array(MAX_ENTITIES),
  isSprinting: [] as boolean[],
  sprintMult: new Float32Array(MAX_ENTITIES),
  accDeltaTime: new Float32Array(MAX_ENTITIES),
  jumpPressed: new Uint8Array(MAX_ENTITIES),
};

export const initializePlayer = (id: number) => {
  Player.maxVelocity[id] = 5;
  Player.isSprinting[id] = false;
  Player.dragDamping[id] = 2;
  Player.sprintMult[id] = 2;
  Player.accDeltaTime[id] = 1;
  Player.jumpPressed[id] = 0;
};

export const isPlayerJump = (id: number) => Player.jumpPressed[id] === 1;

export const PlayerController = {};
