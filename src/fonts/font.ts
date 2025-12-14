import type { Font, Frames, Glyph } from '../types/fonts';
import data from './04B03.json';

let cachedFont: Font | null = null;

const font = () => {
  if (cachedFont) return cachedFont;

  let lineHeight = 0;

  const atlas = new Image();
  atlas.src = '/fonts/04B03/04B03.svg';

  const map: Record<string, Glyph> = {};
  const keys: Record<string, string> = {};
  const frames: Frames = data.frames;
  const layers = data.meta.layers;

  for (const l in layers) {
    const layer = layers[l];
    const cels = layer.cels;

    for (const c in cels) {
      const cell = cels[c];
      const data = cell.data;
      const frame = cell.frame;

      const key = `${layer.name}-${frame}`;

      keys[key] = data;
    }
  }

  for (const f in frames) {
    const char = keys[f];
    if (char === undefined) continue;

    const frame = frames[f];
    const { x, y, w, h } = frame.frame;

    const sourceH = frame.sourceSize.h;
    lineHeight = lineHeight > sourceH ? lineHeight : sourceH;

    map[char] = {
      fx: x,
      fy: y,
      fw: w,
      fh: h,
      offsetY: frame.spriteSourceSize.y,
    };
  }

  cachedFont = {
    atlas,
    map,
    lineHeight,
  };

  return cachedFont;
};

export default font;
