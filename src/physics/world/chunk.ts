import type * as THREE from "three";
import { RAPIER } from "../rapier-world";
import type { RapierWorld } from "../rapier-world";
import { CHUNK_SIZE } from "../../world/constants";
import type R from "@dimforge/rapier3d-compat";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type ChunkKey = string;

function key(cx: number, cz: number): ChunkKey {
  return `${cx},${cz}`;
}

export class ChunkPhysics {
  private chunkBodies = new Map<ChunkKey, R.RigidBody>();
  private chunkColliders = new Map<ChunkKey, R.Collider>();

  constructor(private physics: RapierWorld) {}

  /** Crée ou remplace le collider d’un chunk à partir de sa géométrie (locale chunk). */
  upsertChunkCollider(cx: number, cz: number, geometry: THREE.BufferGeometry) {
    // Nettoie l’ancien
    this.removeChunkCollider(cx, cz);

    // Si pas indexée, on la rend indexée
    if (!geometry.getIndex()) {
      geometry = mergeVertices(geometry); // crée un index + fusion
      geometry.computeVertexNormals(); // optionnel, utile pour rendu
    }

    // Récupère positions + indices
    const posAttr = geometry.getAttribute("position");
    const indexAttr = geometry.getIndex();

    if (!posAttr || posAttr.itemSize !== 3) return;
    if (!indexAttr) return;

    // vertices: Float32Array [x0,y0,z0,x1,y1,z1,...] en coordonnées LOCALES chunk
    const vertices = new Float32Array(posAttr.array as ArrayLike<number>);
    // indices: Uint32Array [i0,i1,i2,...]
    const indices = new Uint32Array(indexAttr.array as ArrayLike<number>);

    // Body fixed positionné au coin du chunk (base en monde)
    const baseX = cx * CHUNK_SIZE;
    const baseZ = cz * CHUNK_SIZE;

    const body = this.physics.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(baseX, 0, baseZ)
    );

    // Collider trimesh local au body
    const colDesc = RAPIER.ColliderDesc.trimesh(vertices, indices).setFriction(
      0.9
    );

    const collider = this.physics.createCollider(colDesc, body);

    const k = key(cx, cz);
    this.chunkBodies.set(k, body);
    this.chunkColliders.set(k, collider);
  }

  /** Supprime collider + body d’un chunk si existant */
  removeChunkCollider(cx: number, cz: number) {
    const k = key(cx, cz);

    // const col = this.chunkColliders.get(k);
    // if (col) {
    //   this.physics.world.removeCollider(col, true);
    //   this.chunkColliders.delete(k);
    // }

    // const body = this.chunkBodies.get(k);
    // if (body) {
    //   this.physics.world.removeRigidBody(body);
    //   this.chunkBodies.delete(k);
    // }
  }

  /** Nettoie tout (utile pour regen monde) */
  clearAll() {
    for (const k of this.chunkColliders.keys()) {
      const [cx, cz] = k.split(",").map(Number);
      this.removeChunkCollider(cx, cz);
    }
  }
}
