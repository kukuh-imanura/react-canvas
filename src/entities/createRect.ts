import type { ECS } from '../types/ecs';

interface CreateRect {
  ecs: ECS;
  x: number;
  y: number;
  w: number;
  h: number;
  vx?: number;
  vy?: number;
  color?: string;
}

const createRect = ({ ecs, x, y, w, h, vx, vy, color }: CreateRect) => {
  const id = ecs.createEntity();

  ecs.Renderable.set(id, { type: 'rect', color });
  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w, h });

  if (vx !== undefined || vy !== undefined) {
    ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  }

  return id;
};

export default createRect;
