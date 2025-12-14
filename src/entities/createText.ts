import layout from '../fonts/layout';
import type { CreateTextOption } from '../types/entities';

const createText = (options: CreateTextOption) => {
  const { ecs, text, x, y, maxW = 100, scale = 1 } = options;
  const id = ecs.createEntity();

  const atlas = new Image();
  atlas.src = '/fonts/04B03/04B03.svg';

  const { data, textHeight } = layout({ text, x, y, maxW, scale });

  atlas.onload = () => {
    ecs.Renderable.set(id, { type: 'text', atlas, data, scale });
  };

  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w: maxW, h: textHeight });

  ecs.StaticBody.set(id, { static: true });

  return id;
};
export default createText;
