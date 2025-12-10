const setupInput = () => {
  const state = { up: false, down: false, left: false, right: false };

  window.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'ArrowUp') state.up = true;
    if (e.key === 's' || e.key === 'ArrowDown') state.down = true;
    if (e.key === 'a' || e.key === 'ArrowLeft') state.left = true;
    if (e.key === 'd' || e.key === 'ArrowRight') state.right = true;
  });

  window.addEventListener('keyup', e => {
    if (e.key === 'w' || e.key === 'ArrowUp') state.up = false;
    if (e.key === 's' || e.key === 'ArrowDown') state.down = false;
    if (e.key === 'a' || e.key === 'ArrowLeft') state.left = false;
    if (e.key === 'd' || e.key === 'ArrowRight') state.right = false;
  });

  return state;
};

export default setupInput;
