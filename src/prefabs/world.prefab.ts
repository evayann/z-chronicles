import type { EngineContext } from "../engine/context";
import { generateHeightmapWorld } from "../world/terrain-gen";

export function createWorld({
  voxels,
  chunkRenderer,
  chunkPhysics,
}: EngineContext) {
  // Voxels + rendu
  generateHeightmapWorld(voxels, {
    baseHeight: 12,
    amplitude: 28,
    frequency: 0.0225,
    octaves: 8,
    persistence: 0.5,
    lacunarity: 2.0,
  });
  chunkRenderer.buildAll(voxels, chunkPhysics);
}
