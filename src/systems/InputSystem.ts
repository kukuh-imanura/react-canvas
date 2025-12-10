import type { ECS } from '../types/ecs';

const InputSystem = (
  ecs: ECS,
  inputState: { up: boolean; down: boolean; left: boolean; right: boolean }
) => {
  return (dt: number) => {
    for (const [id, input] of ecs.Input) {
      input.up = inputState.up;
      input.down = inputState.down;
      input.left = inputState.left;
      input.right = inputState.right;
    }
  };
};

export default InputSystem;
