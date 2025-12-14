import type { TextData } from '../types/ecs';
import type { Layout, MeasureWord } from '../types/fonts';
import font from './font';

const GAP = 1;
const SPACE = GAP * 2;

const layout = ({ text, x, y, maxW, scale }: Layout) => {
  const { map, lineHeight } = font();

  const data: TextData[] = [];

  let charX = x;
  let charY = y;

  text = text.replace(/\s*\n\s*/g, '\n');
  text = text.replace(/ +/g, ' ');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = text[i - 1];

    if (char === '\n') {
      charX = x;
      charY += (lineHeight + GAP) * scale;
      continue;
    }

    if (char === ' ') {
      charX += SPACE * scale;
      continue;
    }

    if (prevChar === ' ') {
      const wordWidth = measureWord({ text, i, map, scale });

      if (charX + wordWidth >= maxW) {
        charX = x;
        charY += (lineHeight + GAP) * scale;
      }
    }

    const { fx, fy, fw, fh, offsetY } = map[char] || map['?'];

    data.push({
      // char, // untuk debug
      fx,
      fy,
      fw,
      fh,
      x: charX,
      y: charY + offsetY,
    });

    charX += fw * scale + 1;
  }

  const textHeight = charY - y + (lineHeight + GAP) * scale;
  return { data, textHeight };
};
export default layout;

const measureWord = ({ text, i, map, scale }: MeasureWord) => {
  let w = 0;

  while (i < text.length && text[i] !== ' ' && text[i] !== '\n') {
    const glyph = map[text[i]] || map['?'];
    w += glyph.fw * scale + GAP;
    i++;
  }

  return w;
};
