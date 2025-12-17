import type { ECS } from '../types/ecs';

const PlayerMovSystem = (ecs: ECS) => {
  const speed = 100;

  return (_dt: number) => {
    for (const [id, input] of ecs.Input) {
      let movX = input.movX;
      let movY = input.movY;

      if (movX && movY) {
        const mov = Math.sqrt(Math.pow(movX, 2) + Math.pow(movY, 2));

        movX = movX / mov;
        movY = movY / mov;
      }

      const vx = movX * speed;
      const vy = movY * speed;

      ecs.Velocity.set(id, { vx, vy });
    }
  };
};
export default PlayerMovSystem;
