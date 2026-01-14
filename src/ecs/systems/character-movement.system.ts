import { query } from "bitecs";
import type { EngineContext } from "../../engine/context";
import type { FrameTime } from "../../engine/time-controller";
import { Character, isCharacterOnGround } from "../components/character";
import * as THREE from "three";

const input = new THREE.Vector3();
const yAxis = new THREE.Vector3(0, 1, 0);
const directionInWorld = new THREE.Vector3();

export function characterMovementSystem(
  { world, three }: EngineContext,
  time: FrameTime
) {
  if (time.paused) return;

  const yaw = three.controls.azimuthAngle;

  for (const e of query(world, [Character])) {
    input.set(
      Character.directionX[e],
      Character.directionY[e],
      Character.directionZ[e]
    );

    const hasMovementInput = input.lengthSq() > 1e-6;
    if (!hasMovementInput) {
      input.set(0, 0, 0);
      if (!isCharacterOnGround(e)) {
        Character.velocityX[e] *= 0.99;
        Character.velocityZ[e] *= 0.99;
        continue;
      }
    }

    input.normalize();
    directionInWorld.copy(input).applyAxisAngle(yAxis, yaw);
    const maxSpeed = 6;
    Character.velocityX[e] = directionInWorld.x * maxSpeed;
    Character.velocityZ[e] = directionInWorld.z * maxSpeed;
  }
}
