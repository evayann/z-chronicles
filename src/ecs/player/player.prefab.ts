import { addEntity, addComponent } from "bitecs";
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { Render3D, RigidBody, Transform } from "../components";
import type { EngineContext } from "../../engine/context";
import { initializePlayer, Player, PlayerController } from "./player.component";
import { Animator } from "../components/animator";
import {
  CharacterMovement,
  initializeCharacterMovement,
} from "../components/character";
import { findSurfaceY } from "../../world/query";

export function createPlayerPrefab(context: EngineContext) {
  const { world, three, assets, physics, voxels } = context;

  const e = addEntity(world);

  addComponent(world, e, Transform);
  addComponent(world, e, Render3D);
  addComponent(world, e, RigidBody);
  addComponent(world, e, Player);
  addComponent(world, e, CharacterMovement);
  addComponent(world, e, PlayerController);
  addComponent(world, e, Animator);

  const spawnX = 0;
  const spawnZ = 0;
  const spawnY = findSurfaceY(voxels, spawnX, spawnZ);

  Transform.x[e] = spawnX;
  Transform.y[e] = spawnY;
  Transform.z[e] = spawnZ;
  Transform.sx[e] = Transform.sy[e] = Transform.sz[e] = 1;
  initializePlayer(e);
  initializeCharacterMovement(e);

  const asset = assets.getGLB("models/player.glb");

  const model = SkeletonUtils.clone(asset.scene);
  model.name = "Player";
  model.scale.setScalar(1);

  three.scene.add(model);
  Render3D.meshId[e] = three.meshes.push(model) - 1;

  const { mixer, id: mixerId } = three.animations.createMixer(model);
  Animator.mixerId[e] = mixerId;
  Animator.state[e] = 0;

  const idle = THREE.AnimationClip.findByName(asset.animationList, "idle");
  if (idle) {
    const action = mixer.clipAction(idle);
    action.play();
  } else {
    console.warn("Idle clip not found in GLB");
  }

  const RAPIER = physics.R;
  const body = physics.createEntityRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(spawnX, spawnY, spawnZ)
  );

  body.lockRotations(true, true);

  physics.createEntityCollider(
    RAPIER.ColliderDesc.capsule(0.6, 0.3)
      .setTranslation(0, 0.85, 0)
      .setFriction(0.8)
      .setRestitution(0.0),
    body
  );

  RigidBody.handle[e] = body.jsHandle;

  three.camera.position.set(24, 18, 24);
  three.controls.setLookAt(24, 18, 24, 0, 0, 0, false);

  return e;
}
