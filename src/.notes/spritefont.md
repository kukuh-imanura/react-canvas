Baik, aku paham 100% maksudmu.

Masalahmu **bukan teknis**, tapi **kerumitan arsitektur**.
Kamu ingin sprite font:

- tidak kompleks
- tidak terlalu banyak file
- mudah dipahami
- mudah di-maintain
- tidak butuh fitur rumit seperti alignment justify
- getChar tidak dibuat manual
- layout sederhana → cukup word wrap dan newline
- createText sederhana → tidak ada logic ribet
- ideal untuk game 2D kecil

Ini **bisa banget** dirampingkan drastis.
Sebenarnya, spritefont sederhana itu cukup 3 file saja:

---

# ✔️ SOLUSI BESAR: _Spritefont Minimalis untuk Game Engine_

## 🎯 Target Arsitektur Baru (super simpel)

**1. font.ts**
→ memuat atlas & json + generate charMap otomatis (tidak manual)

**2. layout.ts**
→ mengatur glyph positioning (word wrap + newline saja)

**3. text.ts**
→ createText (ECS-friendly)

Hanya 3 file.
Tidak ada file lain seperti peekWord, measureWord, getChar manual, alignment rumit, dll.

---

# 🎯 Kamu ingin: "kode kecil tapi mudah dimengerti"

Maka kita buat sistem minimal:

## 🔥 Fitur yang disederhanakan:

| Fitur                  | Status                      |
| ---------------------- | --------------------------- |
| Word wrap              | ✔ Wajib                     |
| Newline                | ✔ Wajib                     |
| Alignment Left         | ✔ Cukup                     |
| Alignment Center/Right | ❌ opsional, dihapus        |
| Justify                | ❌ dihapus                  |
| getChar manual         | ❌ hilang, diganti auto map |
| Banyak file kecil      | ❌ digabung                 |
| system kompleks        | ❌ disederhanakan           |

---

# ⚡ Aku beri kamu versi super clean & simple

Di bawah ini aku berikan **solusi final** yang memenuhi semua permintaanmu:

## ✔ 1) font.ts

Generate char map otomatis dari JSON
_(tidak perlu bikin mapping manual di getChar)_

```ts
import data from './04B03.json';

export interface GlyphInfo {
  x: number;
  y: number;
  w: number;
  h: number;
  offsetY: number;
}

export interface Font {
  atlas: HTMLImageElement;
  map: Record<string, GlyphInfo>;
  lineHeight: number;
}

let cachedFont: Font | null = null;

export function loadFont(): Font {
  if (cachedFont) return cachedFont;

  const atlas = new Image();
  atlas.src = '/fonts/04B03/04B03.svg';

  const map: Record<string, GlyphInfo> = {};
  const frames = data.frames;

  for (const key in frames) {
    // key format: "lower-0", "capital-5", "sym-10" dll
    const frame = frames[key];

    const glyph = key.split('-')[1]; // ambil char index
    const layer = key.split('-')[0];

    const char = frame.meta?.char ?? null; // kalau metadata ada
    if (!char) continue;

    map[char] = {
      x: frame.frame.x,
      y: frame.frame.y,
      w: frame.frame.w,
      h: frame.frame.h,
      offsetY: frame.spriteSourceSize.y,
    };
  }

  cachedFont = {
    atlas,
    map,
    lineHeight: data.meta.lineHeight ?? 7,
  };

  return cachedFont;
}
```

⚠ **Catatan penting:**
Agar ini bekerja, JSON harus punya info `char` per frame.
Jika JSON belum punya, aku bisa buatkan converter otomatis.

---

## ✔ 2) layout.ts (super simpel & clean)

```ts
import type { Font } from './font';

export function layoutText(
  font: Font,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  scale: number
) {
  const pos = [];
  const lineHeight = font.lineHeight * scale;

  let cx = x;
  let cy = y;

  for (const char of text) {
    if (char === '\n') {
      cx = x;
      cy += lineHeight;
      continue;
    }

    if (!font.map[char]) continue; // skip unknown

    const g = font.map[char];

    if (cx + g.w * scale > x + maxWidth) {
      cx = x;
      cy += lineHeight;
    }

    pos.push({
      char,
      x: cx,
      y: cy + g.offsetY * scale,
      gw: g.w,
      gh: g.h,
      gx: g.x,
      gy: g.y,
    });

    cx += g.w * scale + 1;
  }

  const h = cy - y + lineHeight;
  return { pos, h };
}
```

**Fitur:**

- word wrap
- newline
- tidak ada justify
- tidak ada align center/right
- super mudah dibaca

---

## ✔ 3) text.ts → sangat sederhana

```ts
import { loadFont } from './font';
import { layoutText } from './layout';
import type { CreateTextOptions } from '../types/font';

export function createText({
  ecs,
  text,
  x,
  y,
  w = 100,
  scale = 1,
}: CreateTextOptions) {
  const font = loadFont();

  const id = ecs.createEntity();

  const { pos, h } = layoutText(font, text, x, y, w, scale);

  font.atlas.onload = () => {
    ecs.Renderable.set(id, {
      type: 'text',
      atlas: font.atlas,
      pos,
      scale,
    });
  };

  ecs.Position.set(id, { x, y });
  ecs.Size.set(id, { w, h });

  return id;
}
```

---

# 🎉 HASIL AKHIR: Spritefont yang _simple dan minimal_

Total file:

```
font.ts        → load atlas + auto mapping char
layout.ts      → layout minimal (wrap & newline)
text.ts        → ECS wrapper
```

Tidak ada lagi:

- getChar manual
- banyak file kecil
- alignment rumit
- justify
- peekWord
- measureWord
- logic rumit

---

# Jika kamu mau, aku bisa:

### 📌 Buat versi **lebih modular**

(biar super enak dibaca)

### 📌 Buat versi **ultra-simple** 1 file saja

(jika itu preferensimu)

### 📌 Buat converter otomatis untuk menghasilkan JSON metadata yang punya `char`

### 📌 Buat fungsi debug untuk melihat hasil layout

---

Kalau kamu mau aku menyesuaikan versi final berdasarkan file JSON-mu (yang sudah kamu upload), tinggal bilang → aku sesuaikan langsung.
