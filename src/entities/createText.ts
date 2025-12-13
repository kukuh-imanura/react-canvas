import layout from '../fonts/layout';
import type { ECS } from '../types/ecs';

interface CreateText {
  ecs: ECS;
  text: string;
  x: number;
  y: number;
  maxW?: number;
  scale?: number;
}

const createText = ({ ecs, text, x, y, maxW = 100, scale = 1 }: CreateText) => {
  const id = ecs.createEntity();

  const atlas = new Image();
  atlas.src = '/fonts/04B03/04B03.svg';

  const { params, textHeight } = layout({ text, x, y, maxW, scale });

  atlas.onload = () => {
    ecs.Renderable.set(id, { type: 'text', atlas, params, scale });
  };

  ecs.Position.set(id, { x, y });
  ecs.PrevPosition.set(id, { x, y });
  ecs.Size.set(id, { w: maxW, h: textHeight });
  ecs.StaticBody.set(id, { static: true });

  return id;
};
export default createText;
