import type { ECS } from '../types/ecs';

const RenderSystem = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  return (alpha: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // help : mengatur urutan gambar/draw. kalau ini masih berdasarkan id. nanti bisa aku tentukan sendiri. misalnya bg di belakang, particle di depan. atau ketika ada player, diatur berdasarkan posisi y
    for (const id of ecs.entities) {
      const pos = ecs.Position.get(id);
      const size = ecs.Size.get(id);
      const prev = ecs.PrevPosition.get(id);
      const render = ecs.Renderable.get(id);

      if (!pos || !prev || !size || !render) continue;

      const x = prev.x + (pos.x - prev.x) * alpha;
      const y = prev.y + (pos.y - prev.y) * alpha;

      switch (render.type) {
        case 'rect':
          ctx.fillStyle = render.color || 'black';
          ctx.fillRect(Math.round(x), Math.round(y), size.w, size.h);
          break;

        case 'circle':
          render.radius = render.radius || size.h / 2 || size.w / 2;

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
          if (!size) break;

          for (const d of render.datas) {
            ctx.drawImage(
              render.atlas,
              d.fx,
              d.fy,
              d.fw,
              d.fh,
              Math.round(d.x),
              Math.round(d.y),
              d.fw * render.scale,
              d.fh * render.scale
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
