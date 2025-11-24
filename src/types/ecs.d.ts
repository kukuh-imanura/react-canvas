export interface Position {
  x: number;
  y: number;
}

export interface PrevPosition {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Color {
  c: string;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface ECS {
  Position: Map<number, Position>;
  PrevPosition: Map<number, PrevPosition>;
  Size: Map<number, Size>;
  Color: Map<number, Color>;
  Velocity: Map<number, Velocity>;
}
