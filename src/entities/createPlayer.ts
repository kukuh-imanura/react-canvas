import type { CreateImage } from '../types/entities';
import createImage from './factory/createImage';

const createPlayer = (options: CreateImage) => {
  const { ecs, vx, vy } = options;

  const id = createImage(options);

  // ecs.Velocity.set(id, { vx: vx ?? 0, vy: vy ?? 0 });
  ecs.PlayerTag.set(id, { isPlayer: true });

  ecs.InputMap.set(id, {
    up: 'KeyW',
    down: 'KeyS',
    left: 'KeyA',
    right: 'KeyD',
    dash: '',
    interact: '',
    attack: '',
  });

  return id;
};
export default createPlayer;
