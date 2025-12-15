import createText from '../entities/createText';
import createRect from '../entities/factory/createRect';
import type { ECS } from '../types/ecs';

interface DebugOptions {
  ecs: ECS;
  text: string;
  x: number;
  y: number;
  scale?: number;
}

const debug = (options: DebugOptions) => {
  const { ecs, text, x, y, scale = 1 } = options;

  const rectId = createRect({ ecs, x, y, w: 0, h: 0, color: 'red' });
  const id = createText({
    ecs,
    text,
    x: x + 1 * scale,
    y: y + 1 * scale,
    scale,
  });

  const size = ecs.Size.get(id);

  if (size)
    ecs.Size.set(rectId, { w: size.w + 1 * scale, h: size.h + 1 * scale });

  return id;
};
export default debug;
