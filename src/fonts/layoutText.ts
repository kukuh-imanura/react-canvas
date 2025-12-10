import type { TextPos } from '../types/ecs';
import type { Align, Frames, LayoutTextOptions } from '../types/font';
import data from './04B03.json';
import getChar from './getChar';
import peekWord from './peekWord';
import measureWord from './measureWord';

// ---------------------------------------------------
// MAIN
// ---------------------------------------------------
export const layoutText = ({
  text,
  x,
  y,
  w,
  scale,
  align,
}: LayoutTextOptions) => {
  const frames: Frames = data.frames;

  // 1) layout glyph + garis
  const { pos, lineInfo, totalLines, lineHeight } = layoutGlyphs(
    text,
    x,
    y,
    w,
    scale,
    frames
  );

  // 2) apply alignment per line
  applyAlignment(pos, lineInfo, w, align);

  // 3) hasil akhir
  return { pos, h: totalLines * lineHeight };
};

// ---------------------------------------------------
// 1) Layout glyphs + collect line info
// ---------------------------------------------------
function layoutGlyphs(
  text: string,
  xStart: number,
  yStart: number,
  w: number,
  scale: number,
  frames: Frames
) {
  const pos: TextPos[] = [];
  const lineInfo: { start: number; end: number; width: number }[] = [];

  const SPACE = 2 * scale;
  const GAP = 1;

  let x = xStart;
  let y = yStart;
  let lineStartIndex = 0;
  let lineWidth = 0;
  let totalLines = 1;
  let lineHeight = 7 * scale;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // (1) Space
    if (char === ' ') {
      x += SPACE;
      lineWidth += SPACE;
      continue;
    }

    // (2) Newline
    if (char === '\n') {
      closeLine(pos, lineInfo, lineStartIndex, lineWidth);
      ({ x, y, totalLines, lineStartIndex, lineWidth } = newLine(
        xStart,
        y,
        lineInfo.length,
        totalLines,
        pos.length
      ));
      continue;
    }

    // (3) Word wrap
    const word = peekWord(text, i);
    const wordWidth = measureWord(word, frames, scale, GAP);

    if (x + wordWidth > xStart + w) {
      closeLine(pos, lineInfo, lineStartIndex, lineWidth);
      ({ x, y, totalLines, lineStartIndex, lineWidth } = newLine(
        xStart,
        y,
        lineInfo.length,
        totalLines,
        pos.length
      ));
    }

    // (4) Render glyph
    const f = frames[getKeyFromChar(char)];
    lineHeight = f.sourceSize.h * scale;

    const adv = f.frame.w * scale + GAP;

    pos.push({
      char,
      fx: f.frame.x,
      fy: f.frame.y,
      fw: f.frame.w,
      fh: f.frame.h,
      x,
      y: y + f.spriteSourceSize.y * scale,
    });

    x += adv;
    lineWidth += adv;
  }

  // push last line
  closeLine(pos, lineInfo, lineStartIndex, lineWidth);

  return { pos, lineInfo, totalLines, lineHeight };
}

// ---------------------------------------------------
// Helpers for layout
// ---------------------------------------------------
function getKeyFromChar(char: string) {
  const c = getChar(char);
  return `${c.layer}-${c.frame}`;
}

function closeLine(
  pos: TextPos[],
  lineInfo: { start: number; end: number; width: number }[],
  start: number,
  width: number
) {
  lineInfo.push({
    start,
    end: pos.length - 1,
    width,
  });
}

function newLine(
  xStart: number,
  y: number,
  lineCount: number,
  totalLines: number,
  nextIndex: number
) {
  return {
    x: xStart,
    y: y + 10, // actual di-update nanti oleh lineHeight, hanya placeholder
    totalLines: totalLines + 1,
    lineStartIndex: nextIndex,
    lineWidth: 0,
  };
}

// ---------------------------------------------------
// 2) Alignment per line
// ---------------------------------------------------
function applyAlignment(
  pos: TextPos[],
  lineInfo: { start: number; end: number; width: number }[],
  w: number,
  align: Align
) {
  for (const line of lineInfo) {
    if (line.start > line.end) continue; // empty line

    const extra = w - line.width;
    let shift = 0;

    if (align === 'center') shift = extra / 2;
    else if (align === 'right') shift = extra;
    else if (align === 'justify') {
      justifyLine(pos, line, extra);
      continue;
    }

    if (shift !== 0) {
      for (let i = line.start; i <= line.end; i++) {
        pos[i].x += shift;
      }
    }
  }
}

// ---------------------------------------------------
// Justify
// ---------------------------------------------------
function justifyLine(
  pos: TextPos[],
  line: { start: number; end: number; width: number },
  extraSpace: number
) {
  const spaces = countSpaces(pos, line.start, line.end);
  if (spaces === 0) return;

  const add = extraSpace / spaces;

  let shift = 0;
  for (let i = line.start; i <= line.end; i++) {
    pos[i].x += shift;
    if (pos[i].char === ' ') {
      shift += add;
    }
  }
}

function countSpaces(pos: TextPos[], start: number, end: number) {
  let n = 0;
  for (let i = start; i <= end; i++) {
    if (pos[i].char === ' ') n++;
  }
  return n;
}
