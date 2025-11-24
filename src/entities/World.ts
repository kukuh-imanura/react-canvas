interface EntityI {
  draw: (ctx: CanvasRenderingContext2D, alpha: number) => void;
  update: (dt: number) => void;
}

const World = () => {
  const entities: EntityI[] = [];
  const systems: ((dt: number) => void)[] = [];

  const add = (entity: EntityI) => entities.push(entity);

  const addSystem = (fn: (dt: number) => void) => {
    systems.push(fn);
  };

  const update = (dt: number) => {
    for (const e of entities) e.update(dt);
    for (const s of systems) s(dt);
  };

  const draw = (ctx: CanvasRenderingContext2D, alpha: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const e of entities) e.draw(ctx, alpha);
  };

  return { add, draw, update, addSystem };
};
export default World;
