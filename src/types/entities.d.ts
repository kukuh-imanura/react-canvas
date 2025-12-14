import type { ECS, Position } from './ecs';

interface baseEntity extends Position {
  ecs: ECS;
}

export interface CreateRectOption extends baseEntity {
  w: number;
  h: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CreateArcOption extends baseEntity {
  radius: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CreateImageOption extends baseEntity {
  src: string;
  vx?: number;
  vy?: number;
  scale?: number;
  frame?: number;
  frameH?: number;
  frameV?: number;
}

export interface CreateTextOption extends baseEntity {
  text: string;
  maxW?: number;
  scale?: number;
}
