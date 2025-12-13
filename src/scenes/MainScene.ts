import createArc from '../entities/createArc';
import createImage from '../entities/createImage';
import createPlayer from '../entities/createPlayer';
import createRect from '../entities/createRect';
import createText from '../entities/createText';
import type { ECS } from '../types/ecs';

const MainScene = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;

  createRect({
    ecs,
    x: canvas.width - 100,
    y: 0,
    w: 100,
    h: 100,
    vx: -100,
  });

  createArc({
    ecs,
    x: 0,
    y: canvas.height - 100,
    radius: 50,
    vx: 100,
  });

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

  createText({
    ecs,
    text: 'Hello World!!!!!\n Main name ist Kukuh Imanura Bagaskara\n bla bla bla bla bla ',
    x: 10,
    y: 10,
  });

  return ecs;
};

export default MainScene;
