import type { ECS } from '../types/ecs';
import createText from '../entities/createText';
import debug from '../utils/debug';

const InterfaceScene = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  debug({ ecs, text: 'My', x: 0, y: 0 });

  createText({
    ecs,
    text: 'Hello World!!!!!\n Main name ist Kukuh Imanura Bagaskara\n bla bla bla bla bla ',
    x: 10,
    y: 10,
  });

  return ecs;
};

export default InterfaceScene;
