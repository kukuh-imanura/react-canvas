import type { CreateImage } from '../types/entities';
import createImage from './factory/createImage';

const createPlayer = (options: CreateImage) => {
  const { ecs } = options;

  const id = createImage(options);
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
