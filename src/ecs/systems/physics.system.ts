import { query } from "bitecs";
import { Transform, RigidBody } from "../components";
import type { EngineContext } from "../../engine/context";
import type { FrameTime } from "../../engine/time-controller";

export function physicsSystem(
  { world, physics }: EngineContext,
  time: FrameTime
) {
  if (time.paused) return;

  physics.step(time.delta);

  for (const e of query(world, [Transform, RigidBody])) {
    const body = physics.getEntityBody(RigidBody.handle[e]);
    if (!body) continue;

    const t = body.isKinematic() ? body.nextTranslation() : body.translation();
    Transform.x[e] = t.x;
    Transform.y[e] = t.y;
    Transform.z[e] = t.z;

    const r = body.isKinematic() ? body.nextRotation() : body.rotation();
    Transform.rw[e] = r.w;
    Transform.rx[e] = r.x;
    Transform.ry[e] = r.y;
    Transform.rz[e] = r.z;
  }
}
