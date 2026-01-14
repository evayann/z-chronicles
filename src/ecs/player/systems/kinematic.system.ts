import { query } from "bitecs";
import * as THREE from "three";
import type { EngineContext } from "../../../engine/context";
import type { FrameTime } from "../../../engine/time-controller";
import { isPlayerJump, Player } from "../player.component";
import { RigidBody } from "../../components";
import { Character } from "../../components/character";
import { KinematicCharacterController } from "@dimforge/rapier3d-compat";

const _input = new THREE.Vector3();
const _desired = new THREE.Vector3();
const _pos = new THREE.Vector3();
const _next = new THREE.Vector3();

export function kinematicControllerSystem(
  { world, physics, three }: EngineContext,
  time: FrameTime
) {
  if (time.paused) return;

  const dt = time.delta; // adapte selon ton FrameTime

  for (const e of query(world, [RigidBody, Player])) {
    const controller = Player.controller[e];
    const body = physics.getEntityBody(e);
    const collider = physics.getEntityCollider(e); // <-- à fournir dans ton wrapper
    if (!body || !collider) continue;

    // 1) Prendre la vélocité déjà calculée (m/s)
    const vx = Character.velocityX[e] || 0;
    const vz = Character.velocityZ[e] || 0;

    // Gravité + jump: vy stocké dans CharacterMovement.velocityY (m/s)
    // Ici on ne recalcul PAS la direction, juste la gravité.
    const g = -9.81;
    Character.velocityY[e] = (Character.velocityY[e] || 0) + g * dt;

    // Jump (si tu veux que le jump soit “edge-triggered”, fais-le dans isPlayerJump)
    // On peut autoriser le jump seulement si grounded (calculé après le move précédent),
    // mais pour ça il faut mémoriser grounded du frame précédent.
    // Ici, on fait simple: on applique après computedGrounded.
    const vy = Character.velocityY[e];

    // 2) Velocity -> desired translation (mètres pour CE frame)
    _desired.set(vx * dt, vy * dt, vz * dt);

    // if (_desired.lengthSq() > 1e-6)
    //   _desired.normalize().multiplyScalar(speed * dt);

    // // Gravité + jump via une vélocité verticale “maison”
    // // (stocke Player.vy[e] dans ton component pour persister entre frames)
    // const g = -9.81;
    // CharacterMovement.velocityY[e] =
    //   (CharacterMovement.velocityY[e] ?? 0) + g * dt;

    // // Grounded: le controller te dit si le perso est au sol après computeColliderMovement
    // // Donc on calcule d’abord le mouvement horizontal + gravité, puis on lit grounded.
    // _desired.y = CharacterMovement.velocityY[e] * dt;

    // 2) Demander au controller de corriger le mouvement contre les obstacles :contentReference[oaicite:10]{index=10}
    controller.computeColliderMovement(collider, {
      x: _desired.x,
      y: _desired.y,
      z: _desired.z,
    });
    const m = controller.computedMovement(); // corrected movement :contentReference[oaicite:11]{index=11}

    // 3) Appliquer au body kinematic position-based: next translation :contentReference[oaicite:12]{index=12}
    const t = body.translation();
    _pos.set(t.x, t.y, t.z);
    _next.set(_pos.x + m.x, _pos.y + m.y, _pos.z + m.z);

    body.setNextKinematicTranslation({ x: _next.x, y: _next.y, z: _next.z });

    // 4) Grounded + Jump
    const grounded = controller.computedGrounded() ?? false;
    if (grounded) {
      Character.isOnGround[e] = true;
      //   Reset vitesse verticale quand on touche le sol
      if (Character.velocityY[e] < 0) Character.velocityY[e] = 0;
      if (isPlayerJump(e)) {
        Character.velocityY[e] = 6; // jump speed
      }
    } else {
      Character.isOnGround[e] = false;
    }
  }
}
