import { CHUNK_SIZE, CHUNK_HEIGHT, BLOCK_AIR } from "./constants";
import { Chunk } from "./chunk";

function key(cx: number, cz: number) {
  return `${cx},${cz}`;
}

function floorDiv(a: number, b: number) {
  // division entière “mathématique” pour coords négatives
  return Math.floor(a / b);
}

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

export class VoxelWorld {
  private chunks = new Map<string, Chunk>();

  getChunk(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(key(cx, cz));
  }

  ensureChunk(cx: number, cz: number): Chunk {
    const k = key(cx, cz);
    let c = this.chunks.get(k);
    if (!c) {
      c = new Chunk(cx, cz);
      this.chunks.set(k, c);
    }
    return c;
  }

  // coords monde -> block id
  getBlock(wx: number, wy: number, wz: number): number {
    if (wy < 0 || wy >= CHUNK_HEIGHT) return BLOCK_AIR;

    const cx = floorDiv(wx, CHUNK_SIZE);
    const cz = floorDiv(wz, CHUNK_SIZE);
    const chunk = this.getChunk(cx, cz);
    if (!chunk) return BLOCK_AIR;

    const lx = mod(wx, CHUNK_SIZE);
    const lz = mod(wz, CHUNK_SIZE);

    return chunk.get(lx, wy, lz);
  }

  setBlock(wx: number, wy: number, wz: number, id: number) {
    if (wy < 0 || wy >= CHUNK_HEIGHT) return;

    const cx = floorDiv(wx, CHUNK_SIZE);
    const cz = floorDiv(wz, CHUNK_SIZE);
    const chunk = this.ensureChunk(cx, cz);

    const lx = mod(wx, CHUNK_SIZE);
    const lz = mod(wz, CHUNK_SIZE);

    chunk.set(lx, wy, lz, id);
  }

  allChunks(): Iterable<Chunk> {
    return this.chunks.values();
  }
}
