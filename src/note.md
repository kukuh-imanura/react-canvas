ECS = **Entity Component System**
Sebuah arsitektur untuk membuat game (atau simulasi) yang lebih **modular, cepat, dan scalable** dibanding pendekatan OOP biasa.

Dipakai di banyak engine modern: **Unity (DOTS), Bevy, Flecs**, dsb.

Jawaban paling ringkas, langsung inti.

---

# 🧩 1. **Entity**

Objek kosong, cuma ID.

Contoh:

- player = 1
- musuh = 2
- peluru = 3

Entity **tidak punya logika**, tidak punya data langsung.

---

# 🧱 2. **Component**

Data murni. Tidak ada fungsi, tidak ada logika.

Contoh komponen:

- Position { x, y }
- Velocity { vx, vy }
- Sprite { img }
- Health { hp }

Entity = kumpulan komponen.

Contoh:

```
Player (ID 1)
  - Position
  - Velocity
  - Sprite
  - Health
```

---

# ⚙️ 3. **System**

Berisi logika **yang memproses komponen tertentu**.

Contoh:

- MovementSystem → semua entity yang punya Position + Velocity
- RenderSystem → semua entity yang punya Position + Sprite
- HealthSystem → semua entity yang punya Health

System-lah yang jalan setiap frame.

---

# 🎮 Cara kerjanya (super ringkas)

1. Entity dibuat → dikasih komponen
2. System berjalan tiap update/draw:

   - movement system → ubah posisi
   - render system → gambar sprite
   - collision system → cek tabrakan

Entity tidak punya fungsi update sendiri.
Yang update itu **system**, bukan entity.

---

# 🔥 Kenapa dipakai di game modern?

### 1. Performa lebih tinggi

Data-nya linear, gampang di-cache CPU → jauh lebih cepat.

### 2. Modular

Tambah logika tanpa sentuh entity lama.

### 3. Reusable

Komponen tidak saling kenal.

### 4. Cocok untuk banyak objek

Seribu musuh? puluhan ribu partikel? ECS aman.

---

# 📌 Contoh super sederhana (paling minimal)

```ts
// entity = ID
let id = 0;
function createEntity() {
  return id++;
}

// data
const Position = new Map();
const Velocity = new Map();

// system
function movementSystem(dt) {
  for (const [id, pos] of Position) {
    const vel = Velocity.get(id);
    if (!vel) continue;

    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
  }
}
```

Entity cuma angka.
Data dipisah.
System jalanin semuanya.

---

Kalau kamu mau, aku bisa bikin versi **ECS untuk game 2D-mu** yang ringan dan cocok untuk React + Canvas, atau menjelaskan perbedaan **OOP vs ECS**.

Oke, Kuh. Kamu **belum pakai ECS** — kamu masih pakai **Entity punya logic sendiri**, + `world.addSystem()` sebagai patch tambahan.
Kalau kamu mau **beneran pindah ke pola ECS**, kamu harus ubah tiga hal:

1. **Entity = ID (bukan object punya update/draw)**
2. **Component = data murni**
3. **System = fungsi yang memproses kumpulan component**

Di bawah ini aku kasih **cara implementasi ECS paling sederhana dan langsung cocok dengan game kamu sekarang**. Tidak berat, tidak ribet.

---

# ✅ 1. Struktur ECS versi sederhana

### **Entity = angka**

```ts
let nextId = 0;
const createEntity = () => nextId++;
```

### **Storage komponen pakai Map**

Komponen = data saja:

```ts
const Position = new Map(); // id → { x, y }
const Size = new Map(); // id → { w, h }
const Velocity = new Map(); // id → { vx, vy }
const Color = new Map(); // id → { c }
```

### **System memproses data**

Tidak ada `update()` di entity.

---

# 🧱 2. Buat ECS World yang kecil (langsung pakai)

Buat file `ECS.ts`:

```ts
export const ECS = () => {
  const entities: number[] = [];
  let nextId = 0;

  // COMPONENT STORAGE
  const Position = new Map<number, { x: number; y: number }>();
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
    Size,
    Velocity,
    Color,
  };
};
```

Ini sudah cukup untuk game 2D sederhana.

---

# 🎨 3. System Movement (ganti update entity)

Buat file `systems/MovementSystem.ts`:

```ts
export const MovementSystem = (ecs: any) => {
  return (dt: number) => {
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

# 🖼️ 4. System Render (ganti draw entity)

Buat file `systems/RenderSystem.ts`:

```ts
export const RenderSystem = (ecs: any, ctx: CanvasRenderingContext2D) => {
  return (alpha: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const [id, pos] of ecs.Position) {
      const size = ecs.Size.get(id);
      if (!size) continue;

      const color = ecs.Color.get(id)?.c || 'black';

      ctx.fillStyle = color;
      ctx.fillRect(pos.x, pos.y, size.w, size.h);
    }
  };
};
```

---

# 🔥 5. System khusus (teleport kalau lewat batas)

```ts
export const WrapSystem = (ecs: any, canvas: HTMLCanvasElement) => {
  return () => {
    for (const [id, pos] of ecs.Position) {
      const size = ecs.Size.get(id);

      // kasih logika khusus untuk entity tertentu
      if (id === 0 && pos.x > canvas.width) {
        pos.x = -size.w;
      }
    }
  };
};
```

Kamu bisa pilih entity mana yang punya behavior tertentu.

---

# 🧩 6. Pakai di App.tsx

```tsx
import { ECS } from './ecs/ECS';
import { MovementSystem } from './ecs/systems/MovementSystem';
import { RenderSystem } from './ecs/systems/RenderSystem';
import { WrapSystem } from './ecs/systems/WrapSystem';

useEffect(() => {
  if (!ctx) return;

  const ecs = ECS();
  const canvas = ctx.canvas;

  // buat entity rect
  const rect = ecs.createEntity();

  ecs.Position.set(rect, { x: canvas.width / 2, y: canvas.height / 2 });
  ecs.Size.set(rect, { w: 100, h: 100 });
  ecs.Velocity.set(rect, { vx: 100, vy: 0 });
  ecs.Color.set(rect, { c: 'red' });

  // system
  ecs.addSystem(MovementSystem(ecs));
  ecs.addSystem(WrapSystem(ecs, canvas));

  const loop = gameLoops({
    update: ecs.update,
    draw: RenderSystem(ecs, ctx),
  });

  loop.start();
}, [ctx]);
```

---

# 🎉 Hasilnya?

### ✔ Rect bergerak

### ✔ Ketika lewat layar → muncul lagi di x = -w

### ✔ Tidak mengganggu entity lain

### ✔ Logic tidak menempel di Rect.ts

### ✔ Kamu sekarang pakai **ECS sungguhan**

---

# Mau aku ringkas jadi file-folder lengkap siap copy-paste?

Kalau mau, bilang saja **“iya buatkan struktur folder ECS lengkap”**.
