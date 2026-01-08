import { MAX_ENTITIES } from "../entities";

export const CharacterMovement = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
  z: new Float32Array(MAX_ENTITIES),
};

export const initializeCharacterMovement = (id: number) =>
  setCharacterMovement(id, { x: 0, y: 0, z: 0 });

export const resetCharacterMovement = initializeCharacterMovement;

export const setCharacterMovement = (
  id: number,
  { x, y, z }: { x: number; y: number; z: number }
) => {
  CharacterMovement.x[id] = x;
  CharacterMovement.y[id] = y;
  CharacterMovement.z[id] = z;
};
