import type { ECS } from '../types/ecs';

const PrevPosSystem = (ecs: ECS) => {
  return (dt: number) => {
    for (const [id, pos] of ecs.Position) {
      const prev = ecs.PrevPosition.get(id);

      if (!prev) {
        ecs.PrevPosition.set(id, { x: pos.x, y: pos.y });
        continue;
      }
      prev.x = pos.x;
      prev.y = pos.y;
    }
  };
};

export default PrevPosSystem;
