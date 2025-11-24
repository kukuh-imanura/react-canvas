const ECS = () => {
  const entities: number[] = [];
  let nextId = 0;

  // COMPONENT STORAGE
  const Position = new Map<number, { x: number; y: number }>();
  const PrevPosition = new Map<number, { x: number; y: number }>();
  const Size = new Map<number, { w: number; h: number }>();
  const Velocity = new Map<number, { vx: number; vy: number }>();
  const Color = new Map<number, { c: string }>();

  const systems: ((dt: number) => void)[] = [];

  const createEntity = () => {
    const id = nextId++;
    entities.push(id);
    return id;
  };

  const addSystem = (fn: (dt: number) => void) => systems.push(fn);

  const update = (dt: number) => {
    for (const s of systems) s(dt);
  };

  return {
    entities,
    createEntity,
    addSystem,
    update,

    Position,
    PrevPosition,
    Size,
    Velocity,
    Color,
  };
};

export default ECS;
