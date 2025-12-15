import createImage from '../entities/factory/createImage';
import createPlayer from '../entities/createPlayer';
import type { ECS } from '../types/ecs';

const MainScene = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  createImage({
    ecs,
    src: '/sprout-land/chars/Free Chicken Sprites.png',
    x: 0,
    y: 0,
    frame: 0,
    frameH: 4,
    frameV: 2,
  });

  createPlayer({
    ecs,
    src: '/sprout-land/chars/Basic Charakter Spritesheet.png',
    x: 0,
    y: 0,
    frame: 0,
    frameH: 4,
    frameV: 4,
  });

  return ecs;
};

export default MainScene;
