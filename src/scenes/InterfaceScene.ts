import createRect from '../entities/factory/createRect';
import type { ECS } from '../types/ecs';
// import createText from '../entities/createText';
// import debug from '../utils/debug';

const InterfaceScene = (ecs: ECS, _ctx: CanvasRenderingContext2D) => {
  // debug({ ecs, text: 'My', x: 0, y: 0 });

  // createText({
  //   ecs,
  //   text: 'Hello World!!!!!\n Main name ist Kukuh Imanura Bagaskara\n bla bla bla bla bla ',
  //   x: 10,
  //   y: 10,
  // });

  createRect({ ecs, h: 32, w: 32, x: 10, y: 10, color: '#FFFFFF88' });

  return ecs;
};

export default InterfaceScene;
