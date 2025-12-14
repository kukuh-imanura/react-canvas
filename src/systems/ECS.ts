import type {
  ECS as ECS_Type,
  EnemyTag,
  Input,
  PlayerTag,
  Position,
  Renderable,
  Size,
  StaticBody,
  Velocity,
} from '../types/ecs';

const ECS = (): ECS_Type => {
  const entities: number[] = [];
  let nextId = 0;

  // COMPONENT STORAGE
  const Position = new Map<number, Position>();
  const PrevPosition = new Map<number, Position>();
  const Size = new Map<number, Size>();
  const Velocity = new Map<number, Velocity>();

  const Renderable = new Map<number, Renderable>();

  const PlayerTag = new Map<number, PlayerTag>();
  const EnemyTag = new Map<number, EnemyTag>();
  const StaticBody = new Map<number, StaticBody>();

  const Input = new Map<number, Input>();

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

    Renderable,

    PlayerTag,
    EnemyTag,
    StaticBody,

    Input,

    // Terrain: new Map(),
  };
};

export default ECS;
