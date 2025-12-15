import type { CreateRect } from '../../types/entities';

const createRect = (options: CreateRect) => {
  const { ecs, x, y, w, h, vx, vy, color } = options;

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
