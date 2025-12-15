import type { ECS, Position } from './ecs';

interface baseEntity extends Position {
  ecs: ECS;
}

export interface CreateRect extends baseEntity {
  w: number;
  h: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CreateArc extends baseEntity {
  radius: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CreateImage extends baseEntity {
  src: string;
  vx?: number;
  vy?: number;
  scale?: number;
  frame?: number;
  frameH?: number;
  frameV?: number;
}

export interface CreateText extends baseEntity {
  text: string;
  maxW?: number;
  scale?: number;
}
