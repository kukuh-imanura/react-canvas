import createPlayer from '../entities/createPlayer';
import createImage from '../entities/factory/createImage';
import type { ECS } from '../types/ecs';

const MainScene = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;

  createImage({
    ecs,
    src: '/public/design/Test Map.png',
    x: 0,
    y: 0,
  });

  createPlayer({
    ecs,
    src: '/public/design/Char.png',
    x: canvas.width / 2 - 16,
    y: canvas.height / 2 - 32,
    frame: 0,
    frameH: 8,
    frameV: 1,
  });

  return ecs;
};

export default MainScene;
