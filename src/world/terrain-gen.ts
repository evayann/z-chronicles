import { createNoise2D } from "simplex-noise";
import { CHUNK_SIZE, WORLD_RADIUS_CHUNKS, CHUNK_HEIGHT } from "./constants";
import type { VoxelWorld } from "./voxel-world";

// ids de blocs (adapte à ton projet)
const AIR = 0;
const GRASS = 1;
const DIRT = 2;
const STONE = 3;

export type TerrainParams = {
  seed?: number; // optionnel si tu veux seed random stable
  baseHeight?: number; // hauteur moyenne
  amplitude?: number; // variation
  frequency?: number; // "zoom" du bruit
  octaves?: number; // détails
  persistence?: number; // amplitude octave suivante
  lacunarity?: number; // fréquence octave suivante
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function fbm2D(
  noise2D: (x: number, y: number) => number,
  x: number,
  z: number,
  octaves: number,
  persistence: number,
  lacunarity: number
) {
  let value = 0;
  let amp = 1;
  let freq = 1;
  let max = 0;

  for (let i = 0; i < octaves; i++) {
    value += noise2D(x * freq, z * freq) * amp;
    max += amp;
    amp *= persistence;
    freq *= lacunarity;
  }

  return value / (max || 1); // ~[-1..1]
}

export function generateHeightmapWorld(
  voxels: VoxelWorld,
  params: TerrainParams = {}
) {
  const noise2D = createNoise2D(); // si tu veux seed stable, on peut le faire après

  const {
    baseHeight = 12,
    amplitude = 10,
    frequency = 0.02,
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2.0,
  } = params;

  const minChunk = -WORLD_RADIUS_CHUNKS;
  const maxChunk = WORLD_RADIUS_CHUNKS;

  // Nettoyage (si tu as une méthode clear; sinon ignore)
  //   voxels.clear?.();

  for (let cz = minChunk; cz <= maxChunk; cz++) {
    for (let cx = minChunk; cx <= maxChunk; cx++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          const wx = cx * CHUNK_SIZE + lx;
          const wz = cz * CHUNK_SIZE + lz;

          // bruit multi-octaves
          const n = fbm2D(
            noise2D,
            wx * frequency,
            wz * frequency,
            octaves,
            persistence,
            lacunarity
          );

          // convertit [-1..1] -> hauteur
          const h = Math.floor(baseHeight + (n + 1) * 0.5 * amplitude);
          const height = clamp(h, 1, CHUNK_HEIGHT - 1);

          // colonne: stone -> dirt -> grass
          for (let y = 0; y < CHUNK_HEIGHT; y++) {
            let block = AIR;

            if (y < height - 4) block = STONE;
            else if (y < height - 1) block = DIRT;
            else if (y === height - 1) block = GRASS;

            if (block !== AIR) {
              voxels.setBlock(wx, y, wz, block);
            }
          }
        }
      }
    }
  }
}
