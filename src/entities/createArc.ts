import type { ECS } from '../types/ecs';

interface CreateArc {
  ecs: ECS;
  radius: number;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  color?: string;
}

const createArc = ({ ecs, radius, x, y, vx, vy, color }: CreateArc) => {
  const id = ecs.createEntity();

  ecs.Renderable.set(id, { type: 'circle', radius, color });
  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });

  if (vx !== undefined || vy !== undefined) {
    ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  }

  return id;
};

export default createArc;
