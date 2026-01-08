import { query } from "bitecs";
import { RigidBody } from "../../components";
import { Player } from "../player.component";
import type { EngineContext } from "../../../engine/context";
import type { FrameTime } from "../../../engine/time-controller";
import { CharacterMovement } from "../../components/character";

function vdot(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number
) {
  return ax * bx + ay * by + az * bz;
}
function vlen(ax: number, ay: number, az: number) {
  return Math.sqrt(ax * ax + ay * ay + az * az);
}
function vnorm(ax: number, ay: number, az: number) {
  const l = vlen(ax, ay, az);
  if (l === 0) return { x: 0, y: 0, z: 0 };
  return { x: ax / l, y: ay / l, z: az / l };
}

export function playerMovementSystem(
  { world, physics, three }: EngineContext,
  time: FrameTime
) {
  if (time.paused) return;

  const yaw = three.controls.azimuthAngle;

  const sinY = Math.sin(yaw);
  const cosY = Math.cos(yaw);
  const camFwdX = sinY;
  const camFwdZ = cosY;
  const camRightX = cosY;
  const camRightZ = -sinY;

  for (const e of query(world, [RigidBody, Player])) {
    const body = physics.getEntityBody(RigidBody.handle[e]);
    if (!body) continue;

    const inpX = CharacterMovement.x[e];
    const inpY = CharacterMovement.z[e];

    const cv = body.linvel();
    const pos = body.translation();
    const mass = body.mass();

    const movingInput = Math.abs(inpX) + Math.abs(inpY) > 0.001;

    // Ce truc produit un super crash de la physique :)
    // // ---- Drag au repos (extrait de ton bloc) ----
    // if (!movingInput /*&& CharacterState.canJump[e]*/) {
    //   const damping = Player.dragDamping[e];

    //   if (true /*!CharacterState.isOnMovingObject[e]*/) {
    //     body.applyImpulse(
    //       { x: -cv.x * damping, y: 0, z: -cv.z * damping },
    //       false
    //     );
    //   }
    //   //  else {
    //   //     const pvx = CharacterState.platformVx[e];
    //   //     const pvz = CharacterState.platformVz[e];
    //   //     body.applyImpulse(
    //   //       { x: (pvx - cv.x) * damping, y: 0, z: (pvz - cv.z) * damping },
    //   //       true
    //   //     );
    //   //   }
    //   continue;
    // }

    if (!movingInput) continue;

    // ---- direction demandée (dans l’espace world) ----
    // Si tu veux “camera-based”, fais tourner ce vecteur via yaw caméra.
    // const dir = vnorm(inpX, 0, inpY);
    // dir = right*inpX + forward*inpY
    const rawX = camRightX * inpX + camFwdX * inpY;
    const rawZ = camRightZ * inpX + camFwdZ * inpY;
    const dir = vnorm(rawX, 0, rawZ);

    // Attention gros choix de l'ia de remove les quaternion comme ca !

    // ---- slope influence (reprend ton idée, sans quaternion indicator ici) ----
    // const slopeAngle = CharacterState.slopeAngle[e];
    let moveY = 0;
    // if (
    //   Math.abs(slopeAngle) > 0.2 &&
    //   Math.abs(slopeAngle) < CharacterMotor.slopeMaxAngle[e]
    // ) {
    //   moveY = Math.sin(slopeAngle);
    // }

    // ---- vitesse cible ----
    const speed =
      Player.maxVelocity[e] *
      (Player.isSprinting[e] ? Player.sprintMult[e] : 1);

    // plateforme (proj simple): on ajoute la vitesse plateforme sur la direction
    const pvx = 0; //CharacterState.platformVx[e];
    const pvz = 0; //CharacterState.platformVz[e];

    // rejet (ton rejectVel)
    const wantToMoveMag = vdot(cv.x, 0, cv.z, dir.x, 0, dir.z);
    const wantVx = dir.x * wantToMoveMag;
    const wantVz = dir.z * wantToMoveMag;
    const rejectX = cv.x - wantVx;
    const rejectZ = cv.z - wantVz;

    // const rejectMult = CharacterState.isOnMovingObject[e]
    //   ? 0
    //   : CharacterMotor.rejectVelMult[e];
    const rejectMult = 0;

    // Δv/Δt
    const accDt = Player.accDeltaTime[e];
    const targetVx = dir.x * speed + pvx;
    const targetVz = dir.z * speed + pvz;

    const ax = (targetVx - (cv.x + rejectX * rejectMult)) / accDt;
    const az = (targetVz - (cv.z + rejectZ * rejectMult)) / accDt;

    // F = m a
    const fx = ax * mass;
    const fz = az * mass;

    // air control réduit
    // const airMult = CharacterState.canJump[e]
    //   ? 1
    //   : CharacterMotor.airDragMult[e];
    const airMult = 1;

    // pente extra up/down
    let fy = 0;
    if (moveY !== 0) {
      //   fy =
      //     moveY *
      //     (moveY > 0
      //       ? CharacterMotor.slopeUpExtraForce[e]
      //       : CharacterMotor.slopeDownExtraForce[e]) *
      //     (run ? CharacterMotor.sprintMult[e] : 1);
      fy = moveY;
    }

    body.applyImpulseAtPoint(
      { x: fx * airMult, y: fy * airMult, z: fz * airMult },
      {
        x: pos.x,
        y: pos.y + 0 /*CharacterMotor.moveImpulsePointY[e]*/,
        z: pos.z,
      },
      true
    );
  }
}
