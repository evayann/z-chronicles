import * as THREE from "three";
import { CHUNK_SIZE, CHUNK_HEIGHT, BLOCK_AIR } from "../../world/constants";
import type { Chunk } from "../../world/chunk";
import type { VoxelWorld } from "../../world/voxel-world";

// 6 faces d’un cube, avec normales
const FACES = [
  // +X
  {
    n: [1, 0, 0],
    v: [
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
      [1, 0, 1],
    ],
  },
  // -X
  {
    n: [-1, 0, 0],
    v: [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
  // +Y
  {
    n: [0, 1, 0],
    v: [
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
  },
  // -Y
  {
    n: [0, -1, 0],
    v: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
    ],
  },
  // +Z
  {
    n: [0, 0, 1],
    v: [
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 1],
      [0, 0, 1],
    ],
  },
  // -Z
  {
    n: [0, 0, -1],
    v: [
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  },
] as const;

// triangles: 0-1-2, 0-2-3
const TRI = [0, 1, 2, 0, 2, 3];

function blockColor(id: number): [number, number, number] {
  // on fera mieux plus tard (atlas + TSL), là c’est juste visible
  if (id === 1) return [0.25, 0.8, 0.25]; // grass
  return [1, 1, 1];
}

export function buildChunkGeometry(
  world: VoxelWorld,
  chunk: Chunk
): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];

  const baseX = chunk.cx * CHUNK_SIZE;
  const baseZ = chunk.cz * CHUNK_SIZE;

  for (let y = 0; y < CHUNK_HEIGHT; y++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const id = chunk.get(x, y, z);
        if (id === BLOCK_AIR) continue;

        const wx = baseX + x;
        const wz = baseZ + z;

        for (let f = 0; f < 6; f++) {
          const face = FACES[f];

          // voisin dans la direction de la normale
          const nx = wx + face.n[0];
          const ny = y + face.n[1];
          const nz = wz + face.n[2];

          if (world.getBlock(nx, ny, nz) !== BLOCK_AIR) continue;

          const [cr, cg, cb] = blockColor(id);

          for (const i of TRI) {
            const vx = face.v[i][0] + x;
            const vy = face.v[i][1] + y;
            const vz = face.v[i][2] + z;

            positions.push(vx, vy, vz);
            normals.push(face.n[0], face.n[1], face.n[2]);

            const jitter =
              ((wx * 73856093) ^ (wz * 19349663) ^ (y * 83492791)) & 7;
            const j = 1 - jitter * 0.015;
            colors.push(cr * j, cg * j, cb * j);
            // colors.push(cr, cg, cb);
          }
        }
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
