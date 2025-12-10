import type { ECS } from '../types/ecs';

const debug = (ecs: ECS, info: string, x: number = 10, y: number = 10) => {
  const id = ecs.createEntity();

  ecs.Renderable.set(id, { type: 'text', info });
  ecs.Position.set(id, { x, y });

  return id;
};

export default debug;
