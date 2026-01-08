import { CHUNK_HEIGHT } from "./constants";
import type { VoxelWorld } from "./voxel-world";

const AIR = 0;

export function findSurfaceY(voxels: VoxelWorld, x: number, z: number) {
  for (let y = CHUNK_HEIGHT - 1; y >= 0; y--) {
    if (voxels.getBlock(x, y, z) !== AIR) return y + 2;
  }
  return CHUNK_HEIGHT;
}
