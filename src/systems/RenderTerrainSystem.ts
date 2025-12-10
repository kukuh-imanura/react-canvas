// systems/RenderTerrainSystem.ts
import type { ECS } from '../types/ecs';

const CHUNK_SIZE = 64;
const TILE_SIZE = 8;

const RenderTerrainSystem = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  return () => {
    for (const [key, chunk] of ecs.Terrain) {
      const [cx, cy] = key.split(':').map(Number);

      const baseX = cx * CHUNK_SIZE * TILE_SIZE;
      const baseY = cy * CHUNK_SIZE * TILE_SIZE;

      // Render tile
      for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
          const noise = chunk.tiles[y][x];
          const color = Math.floor((noise + 1) * 128);

          ctx.fillStyle = `rgb(${color},${color},${color})`;
          ctx.fillRect(
            baseX + x * TILE_SIZE,
            baseY + y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }

      // Render border chunk
      ctx.strokeStyle = chunk.active ? 'yellow' : 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        baseX,
        baseY,
        CHUNK_SIZE * TILE_SIZE,
        CHUNK_SIZE * TILE_SIZE
      );
    }
  };
};

export default RenderTerrainSystem;
