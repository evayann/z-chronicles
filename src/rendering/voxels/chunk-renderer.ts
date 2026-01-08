import * as THREE from "three";
import type { VoxelWorld } from "../../world/voxel-world";
import type { ThreeContext } from "../three-context";
import { buildChunkGeometry } from "./chunk-mesher";
import { ChunkPhysics } from "../../physics/world/chunk";

function chunkKey(cx: number, cz: number) {
  return `${cx},${cz}`;
}

export class ChunkRenderer {
  #meshes = new Map<string, THREE.Mesh>();
  #material: THREE.Material;

  constructor(private three: ThreeContext) {
    // Pour l’instant: MeshStandardMaterial avec vertexColors
    this.#material = new THREE.MeshStandardMaterial({ vertexColors: true });
  }

  buildAll(world: VoxelWorld, chunkPhysics: ChunkPhysics) {
    for (const chunk of world.allChunks()) {
      const geometryInserted = this.upsertChunk(world, chunk.cx, chunk.cz);
      if (!geometryInserted) return;
      chunkPhysics.upsertChunkCollider(chunk.cx, chunk.cz, geometryInserted);
    }
  }

  upsertChunk(world: VoxelWorld, cx: number, cz: number) {
    const chunk = world.getChunk(cx, cz);
    if (!chunk) return;

    const k = chunkKey(cx, cz);
    const geometry = buildChunkGeometry(world, chunk);

    const existing = this.#meshes.get(k);
    if (existing) {
      existing.geometry.dispose();
      existing.geometry = geometry;
      return geometry;
    }

    const mesh = new THREE.Mesh(geometry, this.#material);
    mesh.position.set(cx * 16, 0, cz * 16); // chunk local coords -> world
    // Attention: buildChunkGeometry construit déjà en coords locales [0..16], donc on offset ici
    // (si tu changes le mesher pour produire coords monde, supprime ce position)
    this.three.scene.add(mesh);
    this.#meshes.set(k, mesh);

    return geometry;
  }

  dispose() {
    for (const m of this.#meshes.values()) {
      this.three.scene.remove(m);
      m.geometry.dispose();
    }
    this.#meshes.clear();
  }
}
