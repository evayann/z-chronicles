import { query } from "bitecs";
import * as THREE from "three";
import { Transform, Render3D, getPosition, getQuaternion } from "../components";
import type { EngineContext } from "../../engine/context";
import type { FrameTime } from "../../engine/time-controller";

export function renderSystem({ world, three }: EngineContext, time: FrameTime) {
  for (const e of query(world, [Transform, Render3D])) {
    const mesh = three.meshes[Render3D.meshId[e]];
    if (!mesh) continue;

    const { x: px, y: py, z: pz } = getPosition(e);
    mesh.position.set(px, py, pz);

    const { x: qx, y: qy, z: qz, w: qw } = getQuaternion(e);
    mesh.setRotationFromQuaternion(new THREE.Quaternion(qx, qy, qz, qw));

    mesh.scale.set(Transform.sx[e], Transform.sy[e], Transform.sz[e]);
  }

  three.controls.update(time.delta);
  three.render();
}
