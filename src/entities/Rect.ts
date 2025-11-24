interface RectI {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  vx?: number;
  vy?: number;
  c?: string;
}

const Rect = ({ id, x, y, w, h, vx, vy, c = '' }: RectI) => {
  let prevX = x;
  let prevY = y;

  const update = (dt: number) => {
    prevX = x;
    prevY = y;

    if (vx) x += vx * dt;
    if (vy) y += vy * dt;
  };

  const draw = (ctx: CanvasRenderingContext2D, alpha: number) => {
    // hitung interpolasi
    const renderX = prevX + (x - prevX) * alpha;
    const renderY = prevY + (y - prevY) * alpha;

    ctx.fillStyle = c;
    ctx.fillRect(Math.round(renderX), Math.round(renderY), w, h);
  };

  return {
    id,

    get x() {
      return x;
    },
    get y() {
      return y;
    },
    set x(v: number) {
      x = v;
    },
    set y(v: number) {
      y = v;
    },

    w,
    h,
    draw,
    update,
  };
};

export default Rect;
