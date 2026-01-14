import { MAX_ENTITIES } from "../entities";

export const Character = {
  isOnGround: [] as boolean[],

  directionX: new Float32Array(MAX_ENTITIES),
  directionY: new Float32Array(MAX_ENTITIES),
  directionZ: new Float32Array(MAX_ENTITIES),

  velocityX: new Float32Array(MAX_ENTITIES),
  velocityY: new Float32Array(MAX_ENTITIES),
  velocityZ: new Float32Array(MAX_ENTITIES),
};

export const initializeCharacter = (id: number) => {
  setCharacterMovement(id, { x: 0, y: 0, z: 0 });
  Character.isOnGround[id] = true;
  Character.velocityX[id] =
    Character.velocityY[id] =
    Character.velocityZ[id] =
      0;
};

export const resetCharacter = initializeCharacter;

export const setCharacterMovement = (
  id: number,
  { x, y, z }: { x: number; y: number; z: number }
) => {
  Character.directionX[id] = x;
  Character.directionY[id] = y;
  Character.directionZ[id] = z;
};
