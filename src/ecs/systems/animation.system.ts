import { query } from "bitecs";
import * as THREE from "three";
import type { EngineContext } from "../../engine/context";
import type { FrameTime } from "../../engine/time-controller";
import { Player } from "../player/player.component";
import { Animator } from "../components/animator";
import { Render3D, RigidBody } from "../components";

const PLAYER_GLB = "models/player.glb";
const CLIP_IDLE = "idle";
const CLIP_RUN = "run";
const CLIP_JUMP = "walk";

export type PlayerAnimRuntime = {
  current: THREE.AnimationAction | null;
  actions: Map<string, THREE.AnimationAction>;
};

export const animRuntimeByEid = new Map<number, PlayerAnimRuntime>();

export function getRuntime(eid: number) {
  let r = animRuntimeByEid.get(eid);
  if (!r) {
    r = { current: null, actions: new Map() };
    animRuntimeByEid.set(eid, r);
  }
  return r;
}

function crossFade(
  from: THREE.AnimationAction | null,
  to: THREE.AnimationAction,
  duration = 0.15
) {
  if (from === to) return;

  to.enabled = true;
  to.reset();
  to.play();

  if (from) {
    from.enabled = true;
    from.crossFadeTo(to, duration, false);
  } else {
    to.fadeIn(duration);
  }
}
function getActionCached(
  runtime: { actions: Map<string, THREE.AnimationAction> },
  mixer: THREE.AnimationMixer,
  clip: THREE.AnimationClip,
  clipName: string
) {
  let action = runtime.actions.get(clipName);
  if (!action) {
    action = mixer.clipAction(clip);

    // Config selon le type d’anim
    if (clipName === CLIP_JUMP) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
    }

    // IMPORTANT: on prépare mais on ne spam pas play ici
    action.enabled = true;
    action.weight = 1;

    runtime.actions.set(clipName, action);
  }
  return action;
}

export function animationSystem(
  { three, world, assets, physics }: EngineContext,
  time: FrameTime
) {
  three.animations.update(time.delta);

  const asset = assets.getGLB(PLAYER_GLB);

  for (const e of query(world, [Player, Animator, Render3D, RigidBody])) {
    const mixerId = Animator.mixerId[e];
    if (mixerId < 0) continue;

    const mixer = three.animations.mixers[mixerId];
    if (!mixer) continue;

    const body = physics.getEntityBody(RigidBody.handle[e]);
    if (!body) continue;

    const lv = body.linvel();
    const speedXZ = Math.hypot(lv.x, lv.z);

    // const grounded = isGrounded(ctx, body);
    const grounded = true;

    let nextState = 0; // idle
    if (!grounded) nextState = 2; // jump
    else if (speedXZ > 0.2) nextState = 1; // run

    // Évite le boulot si state identique
    if (nextState === Animator.state[e] && animRuntimeByEid.has(e)) {
      // Optionnel: speed matching sur run
      const runtime = getRuntime(e);
      if (Animator.state[e] === 1) {
        const runAction = runtime.actions.get(CLIP_RUN);
        if (runAction) {
          const refSpeed = 6.0;
          runAction.timeScale = THREE.MathUtils.clamp(
            speedXZ / refSpeed,
            0.6,
            1.6
          );
        }
      }
      continue;
    }

    // Choisit le nom du clip
    const clipName =
      nextState === 0 ? CLIP_IDLE : nextState === 1 ? CLIP_RUN : CLIP_JUMP;

    // Récupère clip
    const clip = THREE.AnimationClip.findByName(asset.animationList, clipName);
    if (!clip) continue;

    const runtime = getRuntime(e);

    // Crée/cache l’action
    const to = getActionCached(runtime, mixer, clip, clipName);

    // Crossfade depuis current
    const fade = nextState === 2 ? 0.08 : 0.15;
    crossFade(runtime.current, to, fade);

    runtime.current = to;
    Animator.state[e] = nextState;

    // Bonus: timeScale run
    if (nextState === 1) {
      const refSpeed = 6.0;
      to.timeScale = THREE.MathUtils.clamp(speedXZ / refSpeed, 0.6, 1.6);
    } else {
      to.timeScale = 1;
    }
  }
}
