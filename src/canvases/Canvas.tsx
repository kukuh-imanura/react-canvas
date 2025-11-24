import type { ComponentProps } from 'react';

const Canvas = (props: ComponentProps<'canvas'>) => {
  return <canvas {...props}></canvas>;
};

export default Canvas;
