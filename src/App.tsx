import { useEffect } from 'react';
import Canvas from './canvases/Canvas';
import gameLoops from './systems/gameLoops';
import useCanvas from './canvases/useCanvas';
import RenderSystem from './systems/RenderSystem';
import ECS from './systems/ECS';
import Scenes from './scenes';
import Systems from './systems';

const App = () => {
  const { ref, ctx } = useCanvas();

  useEffect(() => {
    if (!ctx) return;

    const ecs = ECS();

    // scenes
    Scenes(ecs, ctx);

    // system
    Systems(ecs);

    const loop = gameLoops({
      draw: RenderSystem(ecs, ctx),
      update: ecs.update,
    });

    loop.start();

    setTimeout(() => {
      loop.stop();
    }, 3000);
  }, [ctx]);

  return (
    <Canvas
      className='image-render-pixel w-full h-screen'
      ref={ref}
    />
  );
};

export default App;
