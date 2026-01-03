import type { ECS } from '../types/ecs';
import InputSystem from './InputSystem';
import MovSystem from './MovSystem';
import PlayerMovSystem from './PlayerMovSystem';
import PrevPosSystem from './PrevPosSystem';

const Systems = (ecs: ECS) => {
  ecs.addSystem(PrevPosSystem(ecs));
  ecs.addSystem(InputSystem(ecs));
  ecs.addSystem(PlayerMovSystem(ecs));
  ecs.addSystem(MovSystem(ecs));
};

export default Systems;
