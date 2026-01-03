import type { ECS } from '../types/ecs';
import InterfaceScene from './InterfaceScene';
import MainScene from './MainScene';

const Scenes = (ecs: ECS, ctx: CanvasRenderingContext2D) => {
  MainScene(ecs, ctx);
  InterfaceScene(ecs, ctx);
};

export default Scenes;
