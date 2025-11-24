import type { ECS } from '../types/ecs';

const RenderSystem = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  return (alpha: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const [id, pos] of ecs.Position) {
      const size = ecs.Size.get(id);
      const prev = ecs.PrevPosition.get(id);
      const color = ecs.Color.get(id)?.c || 'black';

      if (!size || !prev) continue;

      const x = prev.x + (pos.x - prev.x) * alpha;
      const y = prev.y + (pos.y - prev.y) * alpha;

      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), size.w, size.h);
    }
  };
};

export default RenderSystem;
