import type { ECS } from '../types/ecs';

interface CreateImage {
  ecs: ECS;
  src: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  scale?: number;
  frame?: number;
  frameH?: number;
  frameV?: number;
}

const createImage = ({
  ecs,
  src,
  x,
  y,
  vx,
  vy,
  scale = 1,
  frame = 0,
  frameH,
  frameV,
}: CreateImage) => {
  const id = ecs.createEntity();

  const image = new Image();
  image.src = src;

  image.onload = () => {
    let fx = 0;
    let fy = 0;
    let w = image.width;
    let h = image.height;

    if (frameH && frameV) {
      w = image.width / frameH;
      h = image.height / frameV;

      const maxFrame = frameH * frameV - 1;
      const safeFrame = Math.min(Math.max(frame, 0), maxFrame);

      const horizontal = safeFrame % frameH;
      const vertical = Math.floor(safeFrame / frameH);

      fx = horizontal * w;
      fy = vertical * h;
    }

    ecs.Renderable.set(id, { type: 'image', image, fx, fy, scale });

    ecs.Position.set(id, { x, y });
    ecs.PrevPosition.set(id, { x, y });
    ecs.Size.set(id, { w: Math.round(w), h: Math.round(h) });

    if (vx !== undefined || vy !== undefined) {
      ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
    }
  };

  return id;
};
export default createImage;
