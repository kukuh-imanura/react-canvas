import layout from '../fonts/layout';
import type { CreateText } from '../types/entities';

const createText = (options: CreateText) => {
  const { ecs, text, x, y, maxW = 100, scale = 1 } = options;

  const id = ecs.createEntity();

  const atlas = new Image();
  atlas.src = '/fonts/04B03/04B03.svg';

  const { datas, textHeight, textWidth } = layout({ text, x, y, maxW, scale });

  atlas.onload = () => {
    ecs.Renderable.set(id, { type: 'text', atlas, datas, scale });
  };

  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w: textWidth, h: textHeight });

  ecs.StaticBody.set(id, { static: true });

  return id;
};
export default createText;
