import type { ECS } from '../types/ecs';

const keyState: Record<string, boolean> = {};

window.addEventListener('keydown', e => (keyState[e.code] = true));
window.addEventListener('keyup', e => (keyState[e.code] = false));

const InputSystem = (ecs: ECS) => {
  let movX = 0;
  let movY = 0;

  return (_dt: number) => {
    for (const [id, map] of ecs.InputMap) {
      movY = keyState[map.up] ? -1 : keyState[map.down] ? 1 : 0;
      movX = keyState[map.left] ? -1 : keyState[map.right] ? 1 : 0;

      ecs.Input.set(id, {
        movX,
        movY,
        dash: keyState[map.dash] ?? false,
        interact: keyState[map.interact] ?? false,
        attack: keyState[map.attack] ?? false,
      });
    }
  };
};
export default InputSystem;
