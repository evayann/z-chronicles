import { MAX_ENTITIES } from "../entities";

export const Transform = {
  x: new Float32Array(MAX_ENTITIES),
  y: new Float32Array(MAX_ENTITIES),
  z: new Float32Array(MAX_ENTITIES),

  rw: new Float32Array(MAX_ENTITIES),
  rx: new Float32Array(MAX_ENTITIES),
  ry: new Float32Array(MAX_ENTITIES),
  rz: new Float32Array(MAX_ENTITIES),

  sx: new Float32Array(MAX_ENTITIES),
  sy: new Float32Array(MAX_ENTITIES),
  sz: new Float32Array(MAX_ENTITIES),
};

export const getPosition = (id: number) => ({
  x: Transform.x[id],
  y: Transform.y[id],
  z: Transform.z[id],
});

export const getQuaternion = (id: number) => ({
  w: Transform.rw[id],
  x: Transform.rx[id],
  y: Transform.ry[id],
  z: Transform.rz[id],
});
