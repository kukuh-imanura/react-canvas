import { useRef, useEffect, useState } from 'react';



const useCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.imageSmoothingEnabled = false;
    context.imageSmoothingQuality = 'low';

    canvas.width = Math.round(canvas.clientWidth);
    canvas.height = Math.round(canvas.clientHeight);

    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth);
      canvas.height = Math.round(canvas.clientHeight);
    };

    // observer untuk mendeteksi resize elemen canvas
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    resize();
    setCtx(context);

    return () => resizeObserver.disconnect();
  }, []);

  return { ref, ctx };
};

export default useCanvas;
