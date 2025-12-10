// systems/TerrainSystem.ts
import { perlin } from '../utils/perlin';
import type { ECS } from '../types/ecs';

const CHUNK_SIZE = 64;
const TILE_SIZE = 8;

export interface ChunkData {
  tiles: number[][];
  active: boolean;
}

const TerrainSystem = (ecs: ECS) => {
  ecs.Terrain = new Map<string, ChunkData>();

  const getChunkKey = (cx: number, cy: number) => `${cx}:${cy}`;

  const generateChunk = (cx: number, cy: number) => {
    const tiles: number[][] = [];

    for (let y = 0; y < CHUNK_SIZE; y++) {
      tiles[y] = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const nx = cx * CHUNK_SIZE + x;
        const ny = cy * CHUNK_SIZE + y;
        const noise = perlin(nx, ny);
        tiles[y][x] = noise;
      }
    }

    return { tiles, active: false };
  };

  return (dt: number) => {
    const player = ecs.Player?.id;
    if (!player) return;

    const pos = ecs.Position.get(player);
    if (!pos) return;

    const cameraChunkX = Math.floor(pos.x / (CHUNK_SIZE * TILE_SIZE));
    const cameraChunkY = Math.floor(pos.y / (CHUNK_SIZE * TILE_SIZE));

    const viewDistance = 2;

    for (
      let cy = cameraChunkY - viewDistance;
      cy <= cameraChunkY + viewDistance;
      cy++
    ) {
      for (
        let cx = cameraChunkX - viewDistance;
        cx <= cameraChunkX + viewDistance;
        cx++
      ) {
        const key = getChunkKey(cx, cy);

        if (!ecs.Terrain.has(key)) {
          ecs.Terrain.set(key, generateChunk(cx, cy));
        }

        ecs.Terrain.get(key)!.active = true;
      }
    }
  };
};

export default TerrainSystem;
