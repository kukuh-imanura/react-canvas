import type { ECS } from '../types/ecs';

const MovementSystem = (ecs: ECS) => {
  return (dt: number) => {
    for (const [id, pos] of ecs.Position) {
      const vel = ecs.Velocity.get(id);
      if (!vel) continue;

      pos.x += vel.vx * dt;
      pos.y += vel.vy * dt;
    }
  };
};

export default MovementSystem;
