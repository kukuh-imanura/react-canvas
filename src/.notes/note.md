Berikut daftar **komponen ECS** yang *umumnya dibutuhkan* untuk game 2D berbasis canvas (termasuk movement, physics ringan, tile/chunk, input, kamera, dan rendering).
Semua dalam format **simple, modular, dan scalable**.

Aku tulis **komponen**, **fungsi**, dan **code-nya**, langsung siap pakai.

---

# ✅ **1. Komponen dasar (wajib)**

## **Position**

```ts
export interface Position {
  x: number;
  y: number;
}
```

## **PrevPosition**

Untuk interpolation rendering.

```ts
export interface PrevPosition {
  x: number;
  y: number;
}
```

## **Size**

```ts
export interface Size {
  w: number;
  h: number;
}
```

## **Velocity**

```ts
export interface Velocity {
  vx: number;
  vy: number;
}
```

---

# ✅ **2. Komponen untuk rendering**

## **Renderable**

Gunakan versi union-type:

```ts
export type Renderable =
  | { type: "rect"; color?: string }
  | { type: "circle"; radius: number; color?: string }
  | { type: "image"; image: HTMLImageElement };
```

---

# ✅ **3. Komponen game object / tag**

## **Tag / Marker Component**

Ini sangat umum untuk ECS.

### Player

```ts
export interface PlayerTag {
  isPlayer: true;
}
```

### Static (tidak bisa bergerak)

```ts
export interface StaticBody {
  static: true;
}
```

### Enemy

```ts
export interface EnemyTag {
  isEnemy: true;
}
```

### Chunk

```ts
export interface ChunkTag {
  chunkX: number;
  chunkY: number;
}
```

---

# ✅ **4. Komponen input**

### Keyboard input untuk entity (biasanya player)

```ts
export interface Input {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  click?: boolean;
}
```

---

# ✅ **5. Komponen physics (opsional)**

## Acceleration (untuk movement yang halus)

```ts
export interface Acceleration {
  ax: number;
  ay: number;
}
```

## Gravity

```ts
export interface Gravity {
  g: number; // misal 500 piksel/s^2
}
```

## Collider

```ts
export interface Collider {
  solid: boolean;
}
```

## Mass

```ts
export interface Mass {
  mass: number;
}
```

---

# ✅ **6. Komponen kamera**

```ts
export interface Camera {
  x: number;
  y: number;
  zoom: number; // optional
}
```

---

# ✅ **7. Komponen transform (opsional)**

Kalau ingin transform lebih mirip Unity:

```ts
export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}
```

---

# 📌 **Code template untuk ECS storage**

Contoh simpel:

```ts
export interface ECS {
  createEntity: () => number;

  Position: Map<number, Position>;
  PrevPosition: Map<number, PrevPosition>;
  Size: Map<number, Size>;
  Velocity: Map<number, Velocity>;
  Acceleration: Map<number, Acceleration>;
  Gravity: Map<number, Gravity>;
  Collider: Map<number, Collider>;
  Mass: Map<number, Mass>;

  Renderable: Map<number, Renderable>;

  PlayerTag: Map<number, PlayerTag>;
  EnemyTag: Map<number, EnemyTag>;
  StaticBody: Map<number, StaticBody>;
  ChunkTag: Map<number, ChunkTag>;

  Input: Map<number, Input>;
  Camera: Map<number, Camera>;

  addSystem: (sys: any) => void;
}
```

Aku sengaja susun minimalis tapi jelas.

---

# 📌 **Sistem apa yang akan cocok dengan komponen-komponen ini?**

Kalau kamu mau, aku bisa lanjut membuat sistem ECS lengkap:

* **InputSystem** (update komponen Input)
* **PlayerMovSystem** (pakai Input + Velocity)
* **PhysicsSystem** (gravity, acceleration)
* **CollisionSystem** (simple AABB)
* **CameraFollowSystem**
* **ChunkLoadSystem**
* **RenderSystem**

Tinggal bilang, nanti aku buatkan satu per satu.

---

# ✔ Final

Kalau kamu sedang membangun game canvas 2D kecil → **komponen di daftar atas lebih dari cukup** untuk fitur dasar sampai mid-level.

Kalau kamu mau, aku bisa buatkan **folder structure** + **template file** ECS untuk project kamu.

Berikut kumpulan **sistem ECS yang paling umum dan paling berguna** untuk game 2D berbasis canvas.
Aku bikin **praktis, jelas, modular**, dan semua **langsung siap pakai**.

Ini daftar sistem yang biasanya dipakai di game 2D:

---

# ✅ **1. PrevPosSystem**

Menyimpan posisi sebelumnya (buat interpolation atau debugging movement).

### **Kode**

```ts
export const PrevPosSystem = (ecs) => {
  return () => {
    for (const [id, pos] of ecs.Position) {
      ecs.PrevPosition.set(id, { x: pos.x, y: pos.y });
    }
  };
};
```

---

# ✅ **2. MovementSystem**

Menggerakkan entity berdasarkan Velocity.

### **Kode**

```ts
export const MovementSystem = (ecs) => {
  return (dt) => {
    for (const [id, pos] of ecs.Position) {
      const vel = ecs.Velocity.get(id);
      if (!vel) continue;

      pos.x += vel.vx * dt;
      pos.y += vel.vy * dt;
    }
  };
};
```

---

# ✅ **3. AccelerationSystem** (opsional)

Menambah velocity berdasarkan acceleration.

```ts
export const AccelerationSystem = (ecs) => {
  return (dt) => {
    for (const [id, vel] of ecs.Velocity) {
      const acc = ecs.Acceleration.get(id);
      if (!acc) continue;

      vel.vx += acc.ax * dt;
      vel.vy += acc.ay * dt;
    }
  };
};
```

---

# ✅ **4. GravitySystem**

Memberikan gaya gravitasi pada entity.

```ts
export const GravitySystem = (ecs) => {
  return (dt) => {
    for (const [id, vel] of ecs.Velocity) {
      const grav = ecs.Gravity.get(id);
      if (!grav) continue;

      vel.vy += grav.g * dt;
    }
  };
};
```

---

# ✅ **5. InputSystem**

Mengubah input keyboard → komponen Input.

### **Setup event listener di luar sistem**

```ts
export const setupInput = (ecs) => {
  const state = { up: false, down: false, left: false, right: false };

  window.addEventListener("keydown", (e) => {
    if (e.key === "w") state.up = true;
    if (e.key === "s") state.down = true;
    if (e.key === "a") state.left = true;
    if (e.key === "d") state.right = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "w") state.up = false;
    if (e.key === "s") state.down = false;
    if (e.key === "a") state.left = false;
    if (e.key === "d") state.right = false;
  });

  return state;
};
```

### **Sistemnya**

```ts
export const InputSystem = (ecs, inputState) => {
  return () => {
    for (const [id, input] of ecs.Input) {
      input.up = inputState.up;
      input.down = inputState.down;
      input.left = inputState.left;
      input.right = inputState.right;
    }
  };
};
```

---

# ✅ **6. PlayerMovementSystem**

Menggerakkan player berdasarkan input.

```ts
export const PlayerMovementSystem = (ecs) => {
  const speed = 200;

  return (dt) => {
    for (const [id] of ecs.PlayerTag) {
      const pos = ecs.Position.get(id);
      const vel = ecs.Velocity.get(id);
      const input = ecs.Input.get(id);
      if (!vel || !input) continue;

      vel.vx = 0;
      vel.vy = 0;

      if (input.up) vel.vy -= speed;
      if (input.down) vel.vy += speed;
      if (input.left) vel.vx -= speed;
      if (input.right) vel.vx += speed;
    }
  };
};
```

---

# ✅ **7. CollisionSystem** (AABB basic)

Collision kotak sederhana.

```ts
export const CollisionSystem = (ecs) => {
  return () => {
    for (const [a, posA] of ecs.Position) {
      const sizeA = ecs.Size.get(a);
      const colA = ecs.Collider.get(a);
      if (!sizeA || !colA) continue;

      for (const [b, posB] of ecs.Position) {
        if (a === b) continue;

        const sizeB = ecs.Size.get(b);
        const colB = ecs.Collider.get(b);
        if (!sizeB || !colB) continue;

        const overlap =
          posA.x < posB.x + sizeB.w &&
          posA.x + sizeA.w > posB.x &&
          posA.y < posB.y + sizeB.h &&
          posA.y + sizeA.h > posB.y;

        if (overlap) {
          // simple response: stop entity A
          const vel = ecs.Velocity.get(a);
          if (vel) {
            vel.vx = 0;
            vel.vy = 0;
          }
        }
      }
    }
  };
};
```

---

# ✅ **8. CameraFollowSystem**

```ts
export const CameraFollowSystem = (ecs) => {
  return () => {
    const cam = [...ecs.Camera.values()][0];
    if (!cam) return;

    for (const [id] of ecs.PlayerTag) {
      const pos = ecs.Position.get(id);
      if (!pos) continue;

      cam.x = pos.x - 400; // center camera
      cam.y = pos.y - 300;
    }
  };
};
```

---

# ✅ **9. ChunkSystem (untuk infinite terrain)**

Mengaktifkan/mematikan chunk berdasarkan posisi player.

```ts
export const ChunkSystem = (ecs, chunkSize = 256) => {
  return () => {
    for (const [playerId] of ecs.PlayerTag) {
      const pos = ecs.Position.get(playerId);
      if (!pos) continue;

      const cx = Math.floor(pos.x / chunkSize);
      const cy = Math.floor(pos.y / chunkSize);

      for (const [chunkId, chunk] of ecs.ChunkTag) {
        const active = Math.abs(chunk.chunkX - cx) <= 1 &&
                       Math.abs(chunk.chunkY - cy) <= 1;

        chunk.active = active;
      }
    }
  };
};
```

---

# ✅ **10. RenderSystem** (rect + circle + image)

```ts
export const RenderSystem = (ecs, ctx) => {
  return () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const [id, rend] of ecs.Renderable) {
      const pos = ecs.Position.get(id);
      if (!pos) continue;

      if (rend.type === "rect") {
        ctx.fillStyle = rend.color ?? "black";
        const size = ecs.Size.get(id);
        ctx.fillRect(pos.x, pos.y, size.w, size.h);
      }

      if (rend.type === "circle") {
        ctx.fillStyle = rend.color ?? "black";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, rend.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (rend.type === "image") {
        ctx.drawImage(rend.image, pos.x, pos.y);
      }
    }
  };
};
```

---

# 🎯 **Rekomendasi Urutan System**

Ini urutan terbaik:

1. **PrevPosSystem**
2. **InputSystem**
3. **PlayerMovementSystem**
4. **AccelerationSystem**
5. **GravitySystem**
6. **MovementSystem**
7. **CollisionSystem**
8. **CameraFollowSystem**
9. **ChunkSystem**
10. **RenderSystem**

---

# 🎁 Kalau kamu mau:

Aku bisa buatkan:

✔ struktur folder ECS rapi
✔ base ECS engine dengan typing lengkap
✔ sistem yang auto-run per frame
✔ template project siap pakai (Canvas 2D)
✔ atau migrasi ke WebGL/Three.js bila kamu mau render lebih cepat

Tinggal bilang mau yang mana.
