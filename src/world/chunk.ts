import { CHUNK_SIZE, CHUNK_HEIGHT, BLOCK_AIR } from "./constants";

export class Chunk {
  // coords de chunk (en “chunk space”)
  constructor(public cx: number, public cz: number) {}

  // 1 byte par voxel (air/grass). Upgrade en Uint16Array plus tard si besoin.
  blocks = new Uint8Array(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE);

  private index(x: number, y: number, z: number) {
    // x + size * (z + size * y)
    return x + CHUNK_SIZE * (z + CHUNK_SIZE * y);
  }

  get(x: number, y: number, z: number): number {
    if (
      x < 0 ||
      x >= CHUNK_SIZE ||
      y < 0 ||
      y >= CHUNK_HEIGHT ||
      z < 0 ||
      z >= CHUNK_SIZE
    )
      return BLOCK_AIR;
    return this.blocks[this.index(x, y, z)];
  }

  set(x: number, y: number, z: number, id: number) {
    if (
      x < 0 ||
      x >= CHUNK_SIZE ||
      y < 0 ||
      y >= CHUNK_HEIGHT ||
      z < 0 ||
      z >= CHUNK_SIZE
    )
      return;
    this.blocks[this.index(x, y, z)] = id;
  }
}
