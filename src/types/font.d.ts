import type { ECS } from './ecs';

export interface FontMap {
  [key: string]: { layer: string; frame: number };
}

export interface Frames {
  [key: string]: {
    frame: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    sourceSize: {
      w: number;
      h: number;
    };
    duration: number;
  };
}

export type Align = 'left' | 'center' | 'right' | 'justify';

interface BaseTextOptions {
  text: string;
  x: number;
  y: number;
  w: number;
  scale: number;
  align: Align;
}

export interface LayoutTextOptions {
  text: string;
  x: number;
  y: number;
  w: number;
  scale: number;
  align: Align;
}

export interface CreateTextOptions
  extends Omit<LayoutTextOptions, 'w' | 'scale' | 'align'>,
    Partial<Pick<LayoutTextOptions, 'w' | 'scale' | 'align'>> {
  ecs: ECS;
}
