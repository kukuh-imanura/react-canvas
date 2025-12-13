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

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Param {
  char?: string;
  fx: number;
  fy: number;
  fw: number;
  fh: number;
  x: number;
  y: number;
}

export type Renderable =
  | { type: 'rect'; color?: string }
  | { type: 'circle'; radius: number; color?: string }
  | {
      type: 'image';
      image: HTMLImageElement;
      scale: number;
      fx: number;
      fy: number;
    }
  | { type: 'text'; atlas: HTMLImageElement; scale: number; params: Param[] };

export interface PlayerTag {
  isPlayer: boolean;
}

export interface EnemyTag {
  isEnemy: boolean;
}

export interface StaticBody {
  static: boolean;
}

export interface Input {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  click?: boolean;
}

export interface ECS {
  entities: number[];

  // methods
  createEntity: () => number;
  addSystem: (fn: (dt: number) => void) => void;
  update: (dt: number) => void;

  Position: Map<number, Position>;
  PrevPosition: Map<number, PrevPosition>;
  Size: Map<number, Size>;
  Velocity: Map<number, Velocity>;

  Renderable: Map<number, Renderable>;

  PlayerTag: Map<number, PlayerTag>;
  EnemyTag: Map<number, EnemyTag>;
  StaticBody: Map<number, StaticBody>;

  Input: Map<number, Input>;

  // Terrain: Map<string, any>;
  // Player?: { id: number };
}
