import type { CreateArc } from '../../types/entities';

const createArc = (options: CreateArc) => {
  const { ecs, radius, x, y, vx, vy, color } = options;
  const s = 2 * radius;

  const id = ecs.createEntity();

  ecs.Renderable.set(id, { type: 'arc', radius, color });
  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w: s, h: s });

  if (vx !== undefined || vy !== undefined) {
    ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  }

  return id;
};

export default createArc;
