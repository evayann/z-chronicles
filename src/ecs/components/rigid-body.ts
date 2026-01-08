import { MAX_ENTITIES } from "../entities";

export const RigidBody = {
  handle: new Uint32Array(MAX_ENTITIES),
};

let rigidBodyId = 1;
export const getRigidBodyId = () => rigidBodyId++;
