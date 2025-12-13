import type { ECS } from '../types/ecs';

const RenderSystem = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  return (alpha: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const [id, pos] of ecs.Position) {
      const size = ecs.Size.get(id);
      const prev = ecs.PrevPosition.get(id);
      const render = ecs.Renderable.get(id);

      if (!render || !prev) continue;

      const x = prev.x + (pos.x - prev.x) * alpha;
      const y = prev.y + (pos.y - prev.y) * alpha;

      switch (render.type) {
        case 'rect':
          if (!size) break;

          ctx.fillStyle = render.color || 'black';
          ctx.fillRect(Math.round(x), Math.round(y), size.w, size.h);
          break;

        case 'circle':
          ctx.beginPath();
          ctx.fillStyle = render.color || 'black';
          ctx.arc(
            Math.round(x + render.radius),
            Math.round(y + render.radius),
            render.radius,
            0,
            Math.PI * 2
          );
          ctx.fill();
          break;

        case 'image':
          if (!size) break;

          ctx.drawImage(
            render.image,
            render.fx || 0, // frame x
            render.fy || 0, // frame y
            size.w, // frame width
            size.h, // frame height
            Math.round(x), // pos x
            Math.round(y), // pos y
            size.w * render.scale, // draw width (scaled)
            size.h * render.scale // draw height (scaled)
          );
          break;

        case 'text':
          if (!size) return;

          for (const p of render.params) {
            ctx.drawImage(
              render.atlas,
              p.fx,
              p.fy,
              p.fw,
              p.fh,
              Math.round(p.x),
              Math.round(p.y),
              p.fw * render.scale,
              p.fh * render.scale
            );
          }

          break;

        default:
          break;
      }
    }
  };
};

export default RenderSystem;
