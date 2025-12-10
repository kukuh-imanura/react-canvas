import type { ECS } from '../types/ecs';

// help // fix : bagaimana kita tau player mana yang digerakkan?
const PlayerMovementSystem = (ecs: ECS) => {
  const speed = 100;

  return (dt: number) => {
    for (const [id] of ecs.PlayerTag) {
      const vel = ecs.Velocity.get(id);
      const input = ecs.Input.get(id);
      if (!vel || !input) continue;

      vel.vx = 0;
      vel.vy = 0;

      if (input.up) vel.vy -= speed;
      if (input.down) vel.vy += speed;
      if (input.left) vel.vx -= speed;
      if (input.right) vel.vx += speed;
    }
  };
};

export default PlayerMovementSystem;
