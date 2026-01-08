import { query } from "bitecs";
import type { EngineContext } from "../../../engine/context";
import type { FrameTime } from "../../../engine/time-controller";
import { MathUtils } from "three";
import { Player } from "../player.component";
import { CharacterMovement } from "../../components/character";

function wrapPi(a: number) {
  a = (a + Math.PI) % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a - Math.PI;
}

function lerpAngle(current: number, target: number, t: number) {
  const delta = wrapPi(target - current);
  return wrapPi(current + delta * t);
}

// yaw from quaternion (Y axis rotation)
function yawFromQuat(q: { x: number; y: number; z: number; w: number }) {
  // standard yaw extraction for Y-up:
  // yaw = atan2(2(wy + xz), 1 - 2(y^2 + x^2))
  const siny = 2 * (q.w * q.y + q.x * q.z);
  const cosy = 1 - 2 * (q.y * q.y + q.x * q.x);
  return Math.atan2(siny, cosy);
}

function quatFromYaw(yaw: number) {
  const half = yaw * 0.5;
  return { x: 0, y: Math.sin(half), z: 0, w: Math.cos(half) };
}

export function playerFacingSystem(
  { world, three, physics }: EngineContext,
  time: FrameTime
) {
  if (time.paused) return;

  const camYaw = three.controls.azimuthAngle;

  for (const e of query(world, [Player])) {
    let mx = CharacterMovement.x[e];
    let mz = CharacterMovement.z[e];

    const body = physics.getEntityBody(e);
    if (!body) continue;

    if (Math.abs(mx) + Math.abs(mz) < 0.001) continue;

    const inputAngle = Math.atan2(mx, mz);
    const targetYaw = wrapPi(camYaw + inputAngle);

    const currentRotation = body.rotation();
    const currentYaw = yawFromQuat(currentRotation);

    // Frame-rate independent smoothing (same style as your old turnSpeed behavior)
    const turnSpeed = 15; //CharacterMotor.turnSpeed[e]; // e.g. 15
    const t = MathUtils.clamp(1 - Math.exp(-turnSpeed * time.delta), 0, 1);

    const nextYaw = lerpAngle(currentYaw, targetYaw, t);
    // CharacterFacing.yaw[e] = nextYaw;

    // Apply rotation to Rapier body
    body.setRotation(quatFromYaw(nextYaw), true);
  }
}
