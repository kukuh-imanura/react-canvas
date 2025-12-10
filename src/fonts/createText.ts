import { layoutText } from './layoutText';
import { loadFontAtlas } from './loadFontAtlas';
import type { CreateTextOptions } from '../types/font';

const createText = ({
  ecs,
  text,
  x,
  y,
  w = 100,
  scale = 1,
  align = 'left',
}: CreateTextOptions) => {
  text = text.replace(/\n +/g, '\n');

  const id = ecs.createEntity();
  const atlas = loadFontAtlas();

  const { pos, h } = layoutText({
    text,
    x,
    y,
    w,
    scale,
    align,
  });

  atlas.onload = () => {
    ecs.Renderable.set(id, {
      type: 'text',
      atlas,
      pos,
      scale,
    });
  };

  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w, h });
  ecs.StaticBody.set(id, { static: true });

  return id;
};

export default createText;
