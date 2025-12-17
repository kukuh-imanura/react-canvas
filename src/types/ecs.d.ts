export interface Position {
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

export interface TextData {
  char?: string;
  fx: number;
  fy: number;
  fw: number;
  fh: number;
  x: number;
  y: number;
}

interface Rect {
  type: 'rect';
  color?: string;
}
interface Arc {
  type: 'arc';
  radius: number;
  color?: string;
}
interface Image {
  type: 'image';
  image: HTMLImageElement;
  scale: number;
  fx: number;
  fy: number;
}
interface Text {
  type: 'text';
  atlas: HTMLImageElement;
  scale: number;
  datas: TextData[];
}
export type Renderable = Rect | Arc | Image | Text;

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
  movX: number;
  movY: number;
  dash: boolean;
  interact: boolean;
  attack: boolean;
}

export interface InputMap {
  up: string;
  down: string;
  left: string;
  right: string;
  dash: string;
  interact: string;
  attack: string;
}

export interface ECS {
  entities: number[];

  // methods
  createEntity: () => number;
  addSystem: (fn: (dt: number) => void) => void;
  update: (dt: number) => void;

  // Required
  Position: Map<number, Position>;
  PrevPosition: Map<number, Position>;
  Size: Map<number, Size>;
  Velocity: Map<number, Velocity>;

  Renderable: Map<number, Renderable>;

  PlayerTag: Map<number, PlayerTag>;
  EnemyTag: Map<number, EnemyTag>;
  StaticBody: Map<number, StaticBody>;

  Input: Map<number, Input>;
  InputMap: Map<number, InputMap>;

  // Terrain: Map<string, any>;
  // Player?: { id: number };
}
