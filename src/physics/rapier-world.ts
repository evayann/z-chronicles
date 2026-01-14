import RAPIER from "@dimforge/rapier3d-compat";
import type {
  World,
  RigidBody,
  Collider,
  RigidBodyDesc,
  ColliderDesc,
  DebugRenderBuffers,
} from "@dimforge/rapier3d-compat";
import { getRigidBodyId } from "../ecs/components";

export class RapierWorld {
  world: World;
  bodies: RigidBody[] = [];
  colliders: Collider[] = [];

  get R() {
    return RAPIER;
  }

  get debugRender(): DebugRenderBuffers {
    return this.world.debugRender();
  }

  constructor() {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  }

  step(dt?: number) {
    // Optionnel: fixe le timestep si tu veux un step stable
    if (typeof dt === "number") this.world.timestep = dt;
    this.world.step();
  }

  createEntityRigidBody(desc: RigidBodyDesc): RigidBody & { jsHandle: number } {
    const body = this.world.createRigidBody(desc) as RigidBody & {
      jsHandle: number;
    };
    body.jsHandle = getRigidBodyId();
    this.bodies[body.jsHandle] = body;
    return body;
  }

  getEntityBody(handle: number): RigidBody {
    return this.bodies[handle];
  }

  createEntityCollider(desc: ColliderDesc, body?: RigidBody) {
    const col = body
      ? this.world.createCollider(desc, body)
      : this.world.createCollider(desc);

    this.colliders[col.handle] = col;
    return col;
  }

  createRigidBody(desc: RigidBodyDesc): RigidBody {
    return this.world.createRigidBody(desc);
  }

  createCollider(desc: ColliderDesc, body?: RigidBody) {
    return body
      ? this.world.createCollider(desc, body)
      : this.world.createCollider(desc);
  }
}

export async function initRapier() {
  await RAPIER.init();
}
