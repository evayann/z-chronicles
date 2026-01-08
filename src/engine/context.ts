import { createWorld } from "bitecs";
import { ThreeContext } from "../rendering/three-context";
import { TimeController } from "./time-controller";
import { VoxelWorld } from "../world/voxel-world";
import { ChunkRenderer } from "../rendering/voxels/chunk-renderer";
import { initRapier, RapierWorld } from "../physics/rapier-world";
import { AssetManager } from "./assets/asset-manager";
import { Input } from "./inputs/input";
import { ChunkPhysics } from "../physics/world/chunk.ts";

export async function createEngineContext(container: HTMLElement) {
  await initRapier();

  const three = new ThreeContext(container);
  const physics = new RapierWorld();
  return {
    world: createWorld(),
    three,
    physics,
    voxels: new VoxelWorld(),
    chunkPhysics: new ChunkPhysics(physics),
    chunkRenderer: new ChunkRenderer(three),
    time: TimeController.getInstance(),
    input: new Input(),
    assets: new AssetManager(),
  };
}

export type EngineContext = Awaited<ReturnType<typeof createEngineContext>>;
