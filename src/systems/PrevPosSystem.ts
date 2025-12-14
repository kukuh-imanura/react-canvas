import type { ECS } from '../types/ecs';

// idea : ini kan semua prevposnya diatur ulang tiap kali ganti frame? iyakan? bagaimana jika yang di update itu hanya prevpos yang berubah saja? kyk pakai sistem cache biar tidak berat?

const PrevPosSystem = (ecs: ECS) => {
  return (dt: number) => {
    for (const [id, pos] of ecs.Position) {
      const prev = ecs.PrevPosition.get(id);

      if (!prev) {
        ecs.PrevPosition.set(id, { x: pos.x, y: pos.y });
        continue;
      }

      prev.x = pos.x;
      prev.y = pos.y;
    }
  };
};

export default PrevPosSystem;
