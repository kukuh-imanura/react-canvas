import { useEffect } from 'react';
import Canvas from './canvases/Canvas';
import gameLoops from './systems/gameLoops';
import useCanvas from './canvases/useCanvas';
import RenderSystem from './systems/RenderSystem';
import MovSystem from './systems/MovSystem';
import PrevPosSystem from './systems/PrevPosSystem';
import ECS from './systems/ECS';
import MainScene from './scenes/MainScene';
import InputSystem from './systems/InputSystem';
import PlayerMovementSystem from './systems/PlayerMovSystem';
import setupInput from './utils/setupInput';

const App = () => {
  const { ref, ctx } = useCanvas();

  useEffect(() => {
    if (!ctx) return;

    const ecs = ECS();
    MainScene(ecs, ctx);

    // system
    ecs.addSystem(PrevPosSystem(ecs));
    ecs.addSystem(InputSystem(ecs, setupInput()));
    ecs.addSystem(PlayerMovementSystem(ecs));
    ecs.addSystem(MovSystem(ecs));

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
