import type { CreateImage } from '../types/entities';
import createImage from './factory/createImage';

const createPlayer = (options: CreateImage) => {
  const { ecs, vx, vy } = options;

  const id = createImage(options);

  ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  ecs.PlayerTag.set(id, { isPlayer: true });
  ecs.Input.set(id, {});

  return id;
};
export default createPlayer;
