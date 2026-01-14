import { query } from "bitecs";
import * as THREE from "three";
import { TabPageApi } from "tweakpane";
import { getQuaternion, getPosition } from "../../ecs/components";
import { Player } from "../../ecs/player/player.component";
import type { EngineContext } from "../../engine/context";

export class PlayerGuiDebug {
  #slopeRayMesh = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xff00ff })
  );
  #playerId?: number;
  #playerInfo = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { w: 0, x: 0, y: 0, z: 0 },
  };

  constructor(tabPage: TabPageApi) {
    const transformFolder = tabPage.addFolder({ title: "Transform" });
    transformFolder.addBinding(this.#playerInfo, "position");
    transformFolder.addBinding(this.#playerInfo, "rotation");
  }

  addPlayer({ world, three: { scene } }: EngineContext) {
    this.#playerId = query(world, [Player]).at(0);
    scene.add(this.#slopeRayMesh);
  }

  update() {
    if (!this.#playerId) return;
    const { x: px, y: py, z: pz } = getPosition(this.#playerId);
    this.#playerInfo.position.x = px;
    this.#playerInfo.position.y = py;
    this.#playerInfo.position.z = pz;

    const { w: qw, x: qx, y: qy, z: qz } = getQuaternion(this.#playerId);
    this.#playerInfo.rotation.w = qw;
    this.#playerInfo.rotation.x = qx;
    this.#playerInfo.rotation.y = qy;
    this.#playerInfo.rotation.z = qz;

    // this.#slopeRayMesh.position.set(px, py - 0.35, pz);
    this.#slopeRayMesh.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([px, py, pz, px, py - 3, pz]),
        3
      )
    );
  }
}
