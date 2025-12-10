import type { Frames } from '../types/font';
import getChar from './getChar';

const measureWord = (
  word: string,
  frames: Frames,
  scale: number,
  gap: number
) => {
  let width = 0;

  for (const char of word) {
    const c = getChar(char);
    const f = frames[`${c.layer}-${c.frame}`];
    width += f.frame.w * scale + gap;
  }

  return width;
};

export default measureWord;
