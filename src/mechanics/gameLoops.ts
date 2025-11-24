interface I {
  draw: (alpha: number) => void;
  update: (dt: number) => void;
  fps?: number;
}

const gameLoops = ({ draw, update, fps = 60 }: I) => {
  let animationId: number;
  let last = performance.now();
  let accumulator = 0;
  const step = 1000 / fps;

  const loop = (now: number) => {
    animationId = requestAnimationFrame(loop);

    const dt = now - last;
    last = now;
    accumulator += dt;

    // jalankan UPDATE selalu di fixed step (stabil)
    while (accumulator >= step) {
      const dt = step / 1000;
      update(dt); // dt dalam detik
      accumulator -= step;
    }

    const alpha = accumulator / step;
    draw(alpha);
  };

  const start = () => loop(performance.now());
  const stop = () => cancelAnimationFrame(animationId);

  return { start, stop };
};

export default gameLoops;
