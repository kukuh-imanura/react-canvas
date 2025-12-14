import type { CreateImageOption } from '../types/entities';
import createImage from './factories/createImage';

const createPlayer = (option: CreateImageOption) => {
  const { ecs, vx, vy } = option;

  const id = createImage(option);

  ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  ecs.PlayerTag.set(id, { isPlayer: true });
  ecs.Input.set(id, {});

  return id;
};
export default createPlayer;
