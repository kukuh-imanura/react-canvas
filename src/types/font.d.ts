import type { Position, Size } from './ecs';

interface Frame extends Position, Size {}

interface SpriteSourceSize extends Position, Size {}

type SourceSize = Size;

export interface Frames {
  [key: string]: {
    frame: Frame;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: SpriteSourceSize;
    sourceSize: SourceSize;
    duration: number;
  };
}

export interface Glyph {
  fx: number;
  fy: number;
  fw: number;
  fh: number;
  offsetY: number;
}

export interface Font {
  atlas: HTMLImageElement;
  map: Record<string, Glyph>;
  lineHeight: number;
}

export interface Layout {
  text: string;
  x: number;
  y: number;
  maxW: number;
  scale: number;
}

export interface MeasureWord {
  i: number;
  text: string;
  map: Record<string, Glyph>;
  scale: number;
}
