import { useEffect } from 'react';
import Canvas from './canvases/Canvas';
import gameLoops from './mechanics/gameLoops';
import useCanvas from './canvases/useCanvas';
import World from './entities/World';
import RenderSystem from './systems/RenderSystem';
import MovementSystem from './systems/MovementSystem';
import prevPosSystem from './systems/PrevPosSystem';
import ECS from './systems/ECS';

const App = () => {
  const { ref, ctx } = useCanvas();

  const world = World();

  useEffect(() => {
    if (!ctx) return;

    const ecs = ECS();
    const canvas = ctx.canvas;

    // buat entity rect
    const rect = ecs.createEntity();

    ecs.Position.set(rect, { x: canvas.width / 2, y: canvas.height / 2 });
    ecs.PrevPosition.set(rect, { x: canvas.width / 2, y: canvas.height / 2 });
    ecs.Size.set(rect, { w: 100, h: 100 });
    ecs.Velocity.set(rect, { vx: 100, vy: 0 });
    ecs.Color.set(rect, { c: 'red' });

    // system
    ecs.addSystem(prevPosSystem(ecs));
    ecs.addSystem(MovementSystem(ecs));

    const loop = gameLoops({
      update: ecs.update,
      draw: RenderSystem(ecs, ctx),
      fps: 120,
    });
    loop.start();

    setTimeout(() => {
      loop.stop();
    }, 3000);
  }, [ctx]);

  return (
    <Canvas
      className='bg-amber-500 h-screen w-full'
      ref={ref}
    />
  );
};

export default App;
